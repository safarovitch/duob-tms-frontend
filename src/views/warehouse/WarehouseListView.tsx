import React, {useEffect, useState} from "react";
import {Warehouse, WarehouseListProps} from "../../model/Warehouse";
import {
    Box, Button,
    Card, CircularProgress,
    Container, Dialog, DialogActions, DialogTitle, IconButton,
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
import clsx from "clsx";
import {Edit as EditIcon, Search as SearchIcon, Trash2 as DeleteIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import {NavLink as RouterLink} from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {setSelectedWarehouse} from "../../store/actions/warehouseActions";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 500
    },
    bulkOperations: {
        position: 'relative'
    },
    bulkActions: {
        paddingLeft: 4,
        paddingRight: 4,
        marginTop: 6,
        position: 'absolute',
        width: '100%',
        zIndex: 2,
        backgroundColor: theme.palette.background.default
    },
    bulkAction: {
        marginLeft: theme.spacing(2)
    },
    avatar: {
        height: 42,
        width: 42,
        marginRight: theme.spacing(1)
    },
    tableProgressBoxStyle: {position: 'relative', pointerEvents: 'none', backgroundColor: '#00000005'},
    tableProgress: {
        color: "secondary",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));

const WarehouseListView: React.FC<WarehouseListProps> = ({className}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);
    const [idWarehouse, setIdWarehouse] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        getWarehouses().then(null)
    }, [page, debouncedSearchTerm, size])

    const getWarehouses = async () => {
        setLoading(true);
        try {
            const warehousesObj: any = await warehouseService.getFilteredWarehouse(page, size, query);
            setWarehouses(warehousesObj.content)
            setTotal(warehousesObj.totalElements)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getWarehouses()}>Рестарт</Button>
            });
        }
    };

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setQuery(event.target.value);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleWarehouseDelete = (id: number) => {
        setOpenDialog(true)
        setIdWarehouse(id)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const handleAgree = () => {
        setOpenDialog(false)
        warehouseDelete(idWarehouse).then()
    }

    const warehouseDelete = async (id: number) => {
        try {
            await warehouseService.deleteWarehouse(id);

            getWarehouses().then();

            enqueueSnackbar('Склад удален', {
                variant: 'success',
                action: key => (<Button onClick={() => { closeSnackbar(key) }}>OK</Button>)
            })
        } catch (error) {
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: key => (<Button onClick={() => { closeSnackbar(key) }}>OK</Button>)
            })
        }
    }

    return (
        <Page className={classes.root} title="Склады">
            <Container maxWidth={false}>
                <Header/>
                {warehouses && (
                    <Box mt={3} >
                        <Card
                            className={clsx(classes.root, className)}
                        >
                            <Box
                                p={2}
                                minHeight={56}
                                display="flex"
                                alignItems="center"
                            >
                                <TextField
                                    className={classes.queryField}
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
                                    placeholder="Поиск Складов"
                                    value={query}
                                    variant="outlined"
                                /></Box>
                            <PerfectScrollbar>
                                <Box minWidth={700} className={loading ? classes.tableProgressBoxStyle : ''}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Название
                                                </TableCell>
                                                <TableCell align="right">
                                                    Действия
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {warehouses.map((warehouse: Warehouse) => {

                                                return (
                                                    <TableRow
                                                        hover
                                                        key={warehouse.id}
                                                    >
                                                        <TableCell>
                                                            {warehouse.name}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                component={RouterLink}
                                                                to={`/app/warehouses/${warehouse.id}/edit`}
                                                                onClick={() => dispatch(setSelectedWarehouse(warehouse))}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <EditIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                            <IconButton onClick={() => handleWarehouseDelete(warehouse.id!)}>
                                                                <SvgIcon fontSize="small">
                                                                    <DeleteIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    {loading && (<CircularProgress size={48} className={classes.tableProgress}/>)}
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
                            <Dialog
                                open={openDialog}
                                onClose={handleCloseDialog}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">Удалить склад?</DialogTitle>
                                <DialogActions>
                                    <Button onClick={handleAgree} color="primary">
                                        Да
                                    </Button>
                                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                                        Нет
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Card>
                    </Box>
                )}
            </Container>
        </Page>
    )
}

export default WarehouseListView;
