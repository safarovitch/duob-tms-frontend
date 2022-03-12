import React, {useEffect, useState} from "react";
import {
    Box,
    Card, Grid,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow, TextField,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import {CustomerCargo} from "../../model/Customer";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {useDispatch} from "react-redux";
import NoFoundTableBody from "../../components/NoFoundTableBody";
import {useHistory} from "react-router-dom";
import {setSelectedCustomerCargo} from "../../store/actions/customerActions";
import roadService from "../../services/RoadService";
import {RoadTotalCargos} from "../../model/Road";
import useDebounce from "../../hooks/useDebounce";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    totalBalance: {
        paddingLeft: theme.spacing(3),
        paddingTop: theme.spacing(2),
    },
    queryField: {
        width: 150
    },
}));

const RoadCargos: React.FC<{roadId: number}> = ({roadId}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const dispatch = useDispatch()
    const [clientCode, setClientCode] = useState('')
    const debouncedClientCode = useDebounce(clientCode, 500)
    const [barcode, setBarcode] = useState('')
    const debouncedBarcode = useDebounce(barcode, 500)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    const [rows, setRows] = useState<CustomerCargo[]>([])
    const [loading, setLoading] = useState(false)
    const [totalCargos, setTotalCargos] = useState<RoadTotalCargos>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await roadService.getRoadCargos(roadId, page, size, debouncedClientCode, debouncedBarcode)

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
    }, [roadId, enqueueSnackbar, page, size, debouncedClientCode, debouncedBarcode])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const data: any = await roadService.getRoadTotalCargos(roadId, debouncedClientCode, debouncedBarcode)

                if (!cancel) {
                    setTotalCargos(data)
                }
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [roadId, enqueueSnackbar, debouncedClientCode, debouncedBarcode])

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const isGroupCargo = (barcode: string) => barcode === '-';

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

    return rows && (
        <Card className={classes.root}>
            <Box px={2}>
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Код клиента</TableCell>
                                <TableCell>Груз</TableCell>
                                <TableCell>Вид груза</TableCell>
                                <TableCell>Д/Ш/В</TableCell>
                                <TableCell>Обьем(м3)</TableCell>
                                <TableCell>Вес(кг)</TableCell>
                                <TableCell>Стоимост $</TableCell>
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
                                                {row.clientCode}
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
            <Grid container justifyContent="space-between">
                <Grid item className={classes.totalBalance}>
                    {
                        totalCargos && rows.length > 0 && (
                            <Grid container spacing={2}>
                                <Grid item>
                                    Мест: <b>{totalCargos.totalPlace}</b>
                                </Grid>
                                <Grid item>
                                    Стоимост: <b>{totalCargos.amount} $</b>
                                </Grid>
                                <Grid item>
                                    Объем: <b>{totalCargos.totalVolume} м3</b>
                                </Grid>
                                <Grid item>
                                    Вес: <b>{totalCargos.totalWeight} кг</b>
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
    )
}

export default RoadCargos
