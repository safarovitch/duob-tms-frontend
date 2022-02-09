import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    Container,
    Grid,
    makeStyles, Table, TableBody, TableCell, TableHead,
    TablePagination, TableRow,
    TextField
} from "@material-ui/core";
import {useSnackbar} from "notistack";
import moment from "moment";
import {GetListInvoiceResponse} from "../../model/Invoice";
import errorMessageHandler from "../../utils/errorMessageHandler";
import invoiceService from "../../services/InvoiceService";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import Page from "../../components/Page";
import NoFoundTableBody from "../../components/NoFoundTableBody";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const ListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [startDate, setStartDate] = useState(moment().subtract(14, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<GetListInvoiceResponse[]>([])
    const [total, setTotal] = useState<number>(0)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await invoiceService.getFilteredList(page, size, startDate, endDate)

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
    }, [enqueueSnackbar, page, size, startDate, endDate])

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    }

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
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

    return (
        <Page className={classes.root} title="Инвойсы">
            <Container maxWidth="md">
                <Header/>
                <Box mt={3}>
                    <Card>
                        <Box py={3} px={2}>
                            <Grid container spacing={2} alignItems="center">
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
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Номер</TableCell>
                                            <TableCell>Дата</TableCell>
                                            <TableCell>Путь рейса</TableCell>
                                            <TableCell align="center" width="15%">Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        rows.length > 0 ? (
                                            <TableBody>
                                                {
                                                    rows.map(row => (
                                                        <TableRow hover key={row.id}>
                                                            <TableCell>{row.number}</TableCell>
                                                            <TableCell>{row.createdDate}</TableCell>
                                                            <TableCell>{row.description}</TableCell>
                                                            <TableCell>Действия</TableCell>
                                                        </TableRow>
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
                            labelRowsPerPage={'Строк на странице:'}
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

export default ListView