import React, {useEffect, useState} from "react";
import {Warehouse, WarehouseListProps} from "../../model/Warehouse";
import {
    Box,
    Card,
    Container, IconButton,
    InputAdornment,
    makeStyles,
    SvgIcon,
    Table, TableBody, TableCell,
    TableHead, TablePagination, TableRow,
    TextField
} from "@material-ui/core";
import Page from "../../components/Page";
import Header from "./Header";
import warehouseService from "../../services/WarehouseService";
import {Check as CheckIcon, Edit as EditIcon, Search as SearchIcon, X as XIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import {NavLink as RouterLink} from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {setSelectedWarehouse} from "../../store/actions/warehouseActions";
import errorMessageHandler from "../../utils/errorMessageHandler";
import NoFoundTableBody from "../../components/NoFoundTableBody";
import DeleteButton from "../../components/DeleteButton";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 400
    }
}));

const WarehouseListView: React.FC<WarehouseListProps> = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<Warehouse[]>([])

    useEffect(() => {
        getRows().then(null)
    }, [page, debouncedSearchTerm, size])

    const getRows = async () => {
        try {
            setLoading(true)
            setRows([])

            const data: any = await warehouseService.getFilteredWarehouse(page, size, query);
            setRows(data.content)
            setTotal(data.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setQuery(event.target.value);
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
        getRows().then(null)
    }

    return (
        <Page className={classes.root} title="Склады">
            <Container maxWidth="md">
                <Header/>
                <Box mt={3}>
                    <Card>
                        <Box py={3} pl={2}>
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
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Название</TableCell>
                                            <TableCell align="center">Склад назначения</TableCell>
                                            <TableCell align="center" width="15%">Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map((row: Warehouse, index) => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell align="center">
                                                            {row.destination ? <CheckIcon style={{color: 'green'}} /> : <XIcon style={{color: 'red'}}/>}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <IconButton
                                                                component={RouterLink}
                                                                to={`/app/warehouses/${row.id}/edit`}
                                                                onClick={() => dispatch(setSelectedWarehouse(row))}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <EditIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                            <DeleteButton
                                                                index={index}
                                                                rowId={row.id!}
                                                                onDelete={warehouseService.deleteWarehouse}
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
                            labelRowsPerPage={'Количество складов:'}
                            rowsPerPage={size}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                        />
                    </Card>
                </Box>
            </Container>
        </Page>
    )
}

export default WarehouseListView;
