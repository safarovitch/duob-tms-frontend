import React, {useEffect, useState} from "react";
import {
    Box,
    Card, Chip, Grid,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow, TextField,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import {CustomerCargo} from "../../../../model/Customer";
import customerService from "../../../../services/CustomerService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useParams} from "react-router";
import {useDispatch} from "react-redux";
import NoFoundTableBody from "../../../../components/NoFoundTableBody";
import {useHistory} from "react-router-dom";
import {setSelectedCustomerCargo} from "../../../../store/actions/customerActions";
import {
    mapOfColorStatusCargo,
    mapOfStatusCargo,
    mapOfTypeCargoCustomer,
    TypeCargoCustomerEnum
} from "../../../../constants";
import DoneIcon from "@material-ui/icons/Done";
import useDebounce from "../../../../hooks/useDebounce";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 150
    },
}));

const CargoListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const dispatch = useDispatch()
    const [selectedStatus, setSelectedStatus] = useState<string>(TypeCargoCustomerEnum.ACTIVE)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [barcode, setBarcode] = useState('')
    const debouncedBarcode = useDebounce(barcode, 500)
    const [rows, setRows] = useState<CustomerCargo[]>([])
    const [loading, setLoading] = useState(false)
    const {id} = useParams<{id: string}>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await customerService.getActiveCargos(id, page, size, startDate, endDate, debouncedBarcode, selectedStatus)

                if (!cancel) {
                    setRows(data.content)
                    setTotal(data.totalElements)
                }
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [id, page, size, startDate, endDate, debouncedBarcode, selectedStatus, enqueueSnackbar])

    const handleSelectStatus = (status: string) => {
        setSelectedStatus(status)
        setPage(1)
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

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

    const handleBarcodeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setBarcode(event.target.value);
        setPage(1);
    };

    const isGroupCargo = (barcode: string) => barcode === '-';

    return rows && (
        <Card className={classes.root}>
            <Box pb={3} px={2}>
                <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
                    <Grid item>
                        <Grid container spacing={3}>
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
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2}>
                            {Object.keys(TypeCargoCustomerEnum).map((status, index) => (
                                <Grid item key={index}>
                                    {selectedStatus === status ? (
                                        <Chip
                                            label={mapOfTypeCargoCustomer.get(status)}
                                            clickable
                                            color="primary"
                                            onDelete={() => null}
                                            deleteIcon={<DoneIcon />}
                                        />
                                    ) : (
                                        <Chip
                                            label={mapOfTypeCargoCustomer.get(status)}
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
                                <TableCell>Просроченно дней</TableCell>
                                <TableCell>Стоимость хранения ($)</TableCell>
                                <TableCell>Штрих-код</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: CustomerCargo) => (
                                        <TableRow
                                            hover
                                            style={{cursor: 'pointer'}}
                                            key={row.id}
                                            onClick={() => {
                                                dispatch(setSelectedCustomerCargo(row))
                                                history.push(`${window.location.pathname}/show`)
                                            }}
                                        >
                                            <TableCell>
                                                {row.cargos[0].createdDate}
                                            </TableCell>
                                            <TableCell>
                                                {row.productName}
                                            </TableCell>
                                            <TableCell>
                                                {row.cargoTypeName}
                                            </TableCell>
                                            <TableCell>
                                                {row.lengthCargo}/{row.widthCargo}/{row.heightCargo}
                                            </TableCell>
                                            <TableCell>
                                                {row.totalVolume}
                                            </TableCell>
                                            <TableCell>
                                                {row.totalWeight}
                                            </TableCell>
                                            <TableCell>
                                                {row.amount}
                                            </TableCell>
                                            <TableCell>
                                                {isGroupCargo(row.barcode) ? '-' : (row.cargos ? (
                                                    <b style={{color: mapOfColorStatusCargo.get(row.cargos[0].status)}}>{mapOfStatusCargo.get(row.cargos[0].status)}</b>
                                                ) : '-')}
                                            </TableCell>
                                            <TableCell>
                                                {isGroupCargo(row.barcode) ? '-' : (row.cargos ? row.cargos[0].dueDays : '-')}
                                            </TableCell>
                                            <TableCell>
                                                {isGroupCargo(row.barcode) ? '-' : (row.cargos ? row.cargos[0].storagePrice : '-')}
                                            </TableCell>
                                            <TableCell>
                                                {isGroupCargo(row.barcode) ? 'Сборный': row.barcode}
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
                labelRowsPerPage={'Строк на странице:'}
                rowsPerPage={size}
                rowsPerPageOptions={[20, 50, 100]}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
            />
        </Card>
    )
}

export default CargoListView
