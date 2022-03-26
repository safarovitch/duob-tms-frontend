import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    Chip,
    Container,
    Grid,
    makeStyles,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from "@material-ui/core";
import Page from "../../components/Page";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Warehouse, WarehouseStateCargo, WarehouseStateTotal} from "../../model/Warehouse";
import errorMessageHandler from "../../utils/errorMessageHandler";
import warehouseService from "../../services/WarehouseService";
import {useSnackbar} from "notistack";
import LoadingLayout from "../../components/LoadingLayout";
import moment from "moment";
import {useSelector} from "react-redux";
import {User} from "../../model/User";
import usePermission from "../../hooks/usePermission";
import PERMISSIONS from "../../constants/permissions";
import {mapOfColorStatusCargo, mapOfStatusCargo, StatusCargoEnum} from "../../constants";
import DoneIcon from "@material-ui/icons/Done";
import NoFoundTableBody from "../../components/NoFoundTableBody";
import {useHistory} from "react-router-dom";
import {CargoGeneral} from "../../model/Customer";
import useDebounce from "../../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    textFieldSelect: {
        width: 250
    },
    queryField: {
        width: 150
    },
    totalBalance: {
        paddingLeft: theme.spacing(3),
        paddingTop: theme.spacing(2),
    },
}));

const WarehouseStateListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const user = useSelector(({user}: {user: User}) => user)
    const canSelectWarehouse = usePermission(PERMISSIONS.WAREHOUSE_STATE.SELECT_WAREHOUSE)
    const [warehouseId, setWarehouseId] = useState<number>(canSelectWarehouse ? 0 : (user.warehouseId || 1))
    const statuses = [StatusCargoEnum.FORMALIZED, StatusCargoEnum.ARRIVED, StatusCargoEnum.RETURNED]
    const [selectedStatus, setSelectedStatus] = useState<string>(StatusCargoEnum.FORMALIZED)
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [clientCode, setClientCode] = useState('')
    const debouncedClientCode = useDebounce(clientCode, 500)
    const [barcode, setBarcode] = useState('')
    const debouncedBarcode = useDebounce(barcode, 500)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    const [loading, setLoading] = useState(false)
    const [loadingRows, setLoadingRows] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [rows, setRows] = useState<WarehouseStateCargo[]>([])
    const [warehouseStateTotal, setWarehouseStateTotal] = useState<WarehouseStateTotal>()
    const isAdmin = usePermission(PERMISSIONS.ADMIN)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const dataWarehouses: any = await warehouseService.getAllWarehouse()

                if (dataWarehouses.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала склад', {variant: 'info'})
                } else if (!cancel) setWarehouses(dataWarehouses)
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, history])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoadingRows(true)
                setRows([])

                const data: any = await warehouseService.getFilteredWarehouseStateCargos(warehouseId, selectedStatus,
                    startDate, endDate, debouncedClientCode, debouncedBarcode, page, size)

                if (!cancel) {
                    setRows(data.content)
                    setTotal(data.totalElements)
                }
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoadingRows(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, warehouseId, selectedStatus, startDate, endDate, debouncedClientCode, debouncedBarcode, page, size])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setWarehouseStateTotal(undefined)

                const data: any = await warehouseService.getFilteredWarehouseStateTotal(warehouseId, selectedStatus,
                    startDate, endDate, debouncedClientCode, debouncedBarcode)

                !cancel && setWarehouseStateTotal(data)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, warehouseId, selectedStatus, startDate, endDate, debouncedClientCode, debouncedBarcode])

    const handleWarehouseChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setWarehouseId(Number(event.target.value))
        setPage(1)
    }

    const handleSelectStatus = (status: string) => {
        setSelectedStatus(status)
        setPage(1)
    }

    const handleStartDateChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setStartDate(event.target.value)
        setPage(1)
    }

    const handleEndDateChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setEndDate(event.target.value)
        setPage(1)
    }

    const handleClientCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setClientCode(event.target.value);
        setPage(1);
    };

    const handleBarcodeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setBarcode(event.target.value);
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

    const getCargoDate = (cargo: CargoGeneral) => {
        switch (cargo.status) {
            case StatusCargoEnum.FORMALIZED: {
                return cargo.createdDate
            }
            case StatusCargoEnum.ARRIVED: {
                return cargo.arrivalDate
            }
            case StatusCargoEnum.ISSUED: {
                return cargo.dateOfIssue
            }
            case StatusCargoEnum.RETURNED: {
                return cargo.updatedDate
            }
            case StatusCargoEnum.ONROAD: {
                return cargo.updatedDate
            }
        }
    }

    return (
        <Page title="Состояние складов">
            {
                warehouses.length > 0 ? (
                    <Container maxWidth="xl" className={classes.root}>
                        <Header />
                        <Box mt={3}>
                            <Card>
                                <Box py={3} px={2}>
                                    <Grid container spacing={4} alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Grid container spacing={4}>
                                                <Grid item>
                                                    <TextField
                                                        className={classes.textFieldSelect}
                                                        onChange={handleWarehouseChange}
                                                        value={warehouseId}
                                                        disabled={!canSelectWarehouse}
                                                        size="small"
                                                        select
                                                        fullWidth
                                                        label="Выберите склад"
                                                        variant="outlined"
                                                        SelectProps={{
                                                            MenuProps: {
                                                                variant: "selectedMenu",
                                                                anchorOrigin: {
                                                                    vertical: "bottom",
                                                                    horizontal: "left"
                                                                },
                                                                transformOrigin: {
                                                                    vertical: "top",
                                                                    horizontal: "left"
                                                                },
                                                                getContentAnchorEl: null
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem key={0} value={0}>Все</MenuItem>
                                                        {warehouses.map((warehouse) => (
                                                            <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        fullWidth
                                                        type="date"
                                                        label="От"
                                                        onChange={handleStartDateChange}
                                                        value={startDate}
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        fullWidth
                                                        type="date"
                                                        label="До"
                                                        onChange={handleEndDateChange}
                                                        value={endDate}
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container spacing={2}>
                                                {statuses.map((status, index) => (
                                                    <Grid item key={index}>
                                                        {selectedStatus === status ? (
                                                            <Chip
                                                                label={mapOfStatusCargo.get(status)}
                                                                clickable
                                                                color="primary"
                                                                onDelete={() => null}
                                                                deleteIcon={<DoneIcon />}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label={mapOfStatusCargo.get(status)}
                                                                clickable
                                                                onClick={() => handleSelectStatus(status)}
                                                            />
                                                        )}
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box pb={3} px={2}>
                                    <Grid container spacing={3}>
                                        <Grid item>
                                            <TextField
                                                className={classes.queryField}
                                                size="small"
                                                onChange={handleClientCodeChange}
                                                placeholder="Код клиента"
                                                value={clientCode}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                className={classes.queryField}
                                                size="small"
                                                onChange={handleBarcodeChange}
                                                placeholder="Штрих-код"
                                                value={barcode}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <PerfectScrollbar>
                                    <Box minWidth={700}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Дата оформления</TableCell>
                                                    <TableCell>Наименование</TableCell>
                                                    <TableCell>Вид груза</TableCell>
                                                    <TableCell>Д / Ш / В</TableCell>
                                                    <TableCell>Обьем (м3)</TableCell>
                                                    <TableCell>Вес (кг)</TableCell>
                                                    <TableCell>Стоимост $</TableCell>
                                                    <TableCell>Статус</TableCell>
                                                    <TableCell>Дата операции</TableCell>
                                                    <TableCell>Завсклад</TableCell>
                                                    <TableCell>Код клиента</TableCell>
                                                    <TableCell>Код поставщика</TableCell>
                                                    <TableCell>Штрих-код</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {
                                                rows.length > 0 ? (
                                                    <TableBody>
                                                        {rows.map((row: WarehouseStateCargo, index) => (
                                                            <TableRow
                                                                hover
                                                                style={{cursor: 'pointer'}}
                                                                key={index}
                                                                onClick={() => {
                                                                    history.push(`/app/warehouse-state/${row.id}`)
                                                                }}
                                                            >
                                                                <TableCell>{row.groupCargo ? row.createdDate: row.cargos[0].createdDate}</TableCell>
                                                                <TableCell>{row.productName}</TableCell>
                                                                <TableCell>{row.cargoTypeName}</TableCell>
                                                                <TableCell>{row.lengthCargo}/{row.widthCargo}/{row.heightCargo}</TableCell>
                                                                <TableCell>{row.totalVolume}</TableCell>
                                                                <TableCell>{row.totalWeight}</TableCell>
                                                                <TableCell>{row.amount}</TableCell>
                                                                <TableCell>
                                                                    {row.groupCargo ? '-' : (row.cargos ? (
                                                                        <b style={{color: mapOfColorStatusCargo.get(row.cargos[0].status)}}>{mapOfStatusCargo.get(row.cargos[0].status)}</b>
                                                                    ) : '-')}
                                                                </TableCell>
                                                                <TableCell>{row.groupCargo ? '-' : getCargoDate(row.cargos[0])}</TableCell>
                                                                <TableCell>{row.groupCargo ? '-' : row.createdBy}</TableCell>
                                                                <TableCell>{row.clientCode}</TableCell>
                                                                <TableCell>{row.providerCode}</TableCell>
                                                                <TableCell>{row.groupCargo ? 'Сборный': row.cargos[0].barcode}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                ) : <NoFoundTableBody loading={loadingRows}/>
                                            }
                                        </Table>
                                    </Box>
                                </PerfectScrollbar>
                                <Grid container justifyContent="space-between">
                                    <Grid item className={classes.totalBalance}>
                                        {
                                            warehouseStateTotal && rows.length > 0 && (
                                                <Grid container spacing={2}>
                                                    <Grid item>
                                                        Мест: <b>{warehouseStateTotal.totalPlace}</b>
                                                    </Grid>
                                                    {
                                                        isAdmin && (
                                                            <Grid item>
                                                                Стоимост: <b>{warehouseStateTotal.amount} $</b>
                                                            </Grid>
                                                        )
                                                    }
                                                    <Grid item>
                                                        Обьем: <b>{warehouseStateTotal.totalVolume} м3</b>
                                                    </Grid>
                                                    <Grid item>
                                                        Вес: <b>{warehouseStateTotal.totalWeight} кг</b>
                                                    </Grid>
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                    <Grid item>
                                        <TablePagination
                                            component="div"
                                            count={total}
                                            onPageChange={handlePageChange}
                                            page={page - 1}
                                            labelRowsPerPage={'Строк на странице:'}
                                            rowsPerPage={size}
                                            rowsPerPageOptions={[20, 50, 100]}
                                            onRowsPerPageChange={handleRowsPerPageChange}
                                            labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    )
}

export default WarehouseStateListView