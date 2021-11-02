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
import {CustomerReconciliationAct} from "../../../../model/Customer";
import customerService from "../../../../services/CustomerService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useParams} from "react-router";
import moment from "moment";
import NoFoundTableBody from "../../../../components/NoFoundTableBody";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const ReconciliationActListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(5)
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [rows, setRows] = useState<CustomerReconciliationAct[]>([])
    const [loading, setLoading] = useState(false)
    const {id: customerId} = useParams<{id: string}>()

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await customerService.getReconciliationActs(customerId, page, size, startDate, endDate)

                setRows(data.content)
                setTotal(data.totalElements)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [enqueueSnackbar, customerId, page, size, startDate, endDate])

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

    return (
        <Card className={classes.root}>
            <Box pb={3} pl={2}>
                <Grid container spacing={2}>
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
            </Box>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table size="small">
                        <TableHead >
                            <TableRow >
                                <TableCell rowSpan={2} align="center">
                                    Дата
                                </TableCell>
                                <TableCell colSpan={2} align="center">
                                    Поступление
                                </TableCell>
                                <TableCell colSpan={2} align="center">
                                    Скидка
                                </TableCell>
                                <TableCell colSpan={2} align="center">
                                    Оплата
                                </TableCell>
                                <TableCell colSpan={2} align="center">
                                    Остаток
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Сумма $</TableCell>
                                <TableCell>Места</TableCell>
                                <TableCell>Сумма $</TableCell>
                                <TableCell>Места</TableCell>
                                <TableCell>Сумма $</TableCell>
                                <TableCell>Места</TableCell>
                                <TableCell>Сумма $</TableCell>
                                <TableCell>Места</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: CustomerReconciliationAct, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{row.income}</TableCell>
                                            <TableCell>{row.incomeQuantity}</TableCell>
                                            <TableCell>{row.discount}</TableCell>
                                            <TableCell>{row.discountQuantity}</TableCell>
                                            <TableCell>{row.outcome}</TableCell>
                                            <TableCell>{row.outcomeQuantity}</TableCell>
                                            <TableCell>{row.balance}</TableCell>
                                            <TableCell>{row.balanceQuantity}</TableCell>
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
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
            />
        </Card>
    )
}

export default ReconciliationActListView

