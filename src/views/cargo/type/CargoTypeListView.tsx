import React, {useState, useEffect, useReducer} from 'react';
import {Box, Card, IconButton, InputAdornment,
    makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField
} from '@material-ui/core';
import {Search as SearchIcon, Edit as EditIcon, Check as CheckIcon, X as XIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import 'moment/locale/ru';
import {useDispatch} from "react-redux";
import useDebounce from "../../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {CargoType} from "../../../model/Cargo";
import {setSelectedType} from "../../../store/actions/cargoActions";
import cargoService from "../../../services/CargoService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import DeleteButton from "../../../components/DeleteButton";
import NoFoundTableBody from "../../../components/NoFoundTableBody";

const useStyles = makeStyles(() => ({
    queryField: {
        width: 400
    },
}));

const CargoTypeListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [rows, setRows] = useState<CargoType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await cargoService.getFilteredCargoTypes(page, size, debouncedSearchTerm);
                setRows(data.content)
                setTotal(data.totalElements)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [updateRows, enqueueSnackbar, page, debouncedSearchTerm, size]);

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setQuery(event.target.value);
        setPage(1);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleDeleteRow = () => {
        setPage(1)
        setUpdateRows()
    };

    return (
        <Card>
            <Box pt={4} pb={2} pl={2}>
                <TextField
                    className={classes.queryField}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SvgIcon
                                    fontSize="small"
                                    color="action"
                                >
                                    <SearchIcon/>
                                </SvgIcon>
                            </InputAdornment>
                        )
                    }}
                    onChange={handleQueryChange}
                    placeholder="Поиск"
                    value={query}
                    variant="outlined"
                />
            </Box>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Название</TableCell>
                                <TableCell align="center">Ручная цена</TableCell>
                                <TableCell align="center">Договорная цена</TableCell>
                                <TableCell align="center">Расчет по норме и весу</TableCell>
                                <TableCell align="center">Учитывать скидку</TableCell>
                                <TableCell align="center" width="15%">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: CargoType, index) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell align="center">
                                                {row.manualPrice ? (<CheckIcon style={{color: 'green'}}/>) : (<XIcon style={{color: 'red'}}/>)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.negotiatedPrice ? (<CheckIcon style={{color: 'green'}}/>) : (<XIcon style={{color: 'red'}}/>)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.calculationRateWeight ? (<CheckIcon style={{color: 'green'}}/>) : (<XIcon style={{color: 'red'}}/>)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.discount ? (<CheckIcon style={{color: 'green'}}/>) : (<XIcon style={{color: 'red'}}/>)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/cargo/type/edit`}
                                                    onClick={() => dispatch(setSelectedType(row))}
                                                >
                                                    <SvgIcon fontSize="small">
                                                        <EditIcon/>
                                                    </SvgIcon>
                                                </IconButton>
                                                <DeleteButton
                                                    index={index}
                                                    rowId={row.id!}
                                                    onDelete={cargoService.deleteCargoType}
                                                    handleDelete={handleDeleteRow}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            ) : <NoFoundTableBody loading={loading}/>
                        }
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={total}
                onPageChange={handlePageChange}
                page={page - 1}
                labelRowsPerPage={'Количество наименований:'}
                rowsPerPage={size}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
            />
        </Card>
    );
}

export default CargoTypeListView;
