import React, {useState, useEffect, useReducer} from 'react';
import {Box, Card, IconButton, InputAdornment,
    makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField
} from '@material-ui/core';
import {Search as SearchIcon, Edit as EditIcon, ArrowRight as ArrowRightIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import useDebounce from "../../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {CargoTariff} from "../../../model/Cargo";
import {setSelectedCargoTariff} from "../../../store/actions/cargoActions";
import cargoService from "../../../services/CargoService";
import DeleteButton from "../../../components/DeleteButton";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import DefaultButton from "../../../components/DefaultButton";

const useStyles = makeStyles(() => ({
    queryField: {
        width: 400
    },
}));

const CargoTariffListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [rows, setRows] = useState<{[key: string]: CargoTariff[]}>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows(undefined)

                const data: any = await cargoService.getFilteredCargoTariffs(page, size, debouncedSearchTerm);

                if (!cancel) {
                    setRows(data.content.reduce((r: any, a: CargoTariff) => {
                        r[a.warehouseDto!.name] = [...r[a.warehouseDto!.name] || [], a]
                        return r
                    }, {}))
                    setTotal(data.totalElements)
                }
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
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
        <>
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
                                    <TableCell>Филиал</TableCell>
                                    <TableCell>Название</TableCell>
                                    <TableCell>Описание</TableCell>
                                    <TableCell align="center" width="18%">Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                rows ? (
                                    <TableBody>
                                        {
                                            Object.keys(rows).map((value: string) => (
                                                rows[value].map((row: CargoTariff, index) => (
                                                    <TableRow hover key={row.id}>
                                                        {index === 0 && (
                                                            <TableCell rowSpan={rows[value].length}>{value}</TableCell>
                                                        )}
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.description}</TableCell>
                                                        <TableCell align="center">
                                                            <DefaultButton
                                                                rowId={row.id!}
                                                                rowDefault={row.defaultValue}
                                                                onSetDefault={cargoService.setDefaultCargoTariff}
                                                                handleSetDefault={setUpdateRows}
                                                            />
                                                            <IconButton
                                                                component={RouterLink}
                                                                to={`/app/cargo/tariff/edit`}
                                                                onClick={() => dispatch(setSelectedCargoTariff(row))}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <EditIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                            <DeleteButton
                                                                index={index}
                                                                rowId={row.id!}
                                                                onDelete={cargoService.deleteCargoTariff}
                                                                handleDelete={handleDeleteRow}
                                                            />
                                                            <IconButton
                                                                component={RouterLink}
                                                                to={`/app/cargo/tariff/${row.id}/history`}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <ArrowRightIcon />
                                                                </SvgIcon>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ))
                                        }
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
                    labelRowsPerPage={'Количество тарифов:'}
                    rowsPerPage={size}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                />
            </Card>
        </>
    );
}

export default CargoTariffListView;
