import React, {useEffect, useReducer, useState} from "react";
import {
    Box, Breadcrumbs, Button,
    Card,
    Container,
    Grid, IconButton, Link,
    makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead,
    TablePagination, TableRow,
    TextField, Typography
} from "@material-ui/core";
import {useSnackbar} from "notistack";
import moment from "moment";
import {GetListInvoiceResponse} from "../../model/Invoice";
import errorMessageHandler from "../../utils/errorMessageHandler";
import invoiceService from "../../services/InvoiceService";
import PerfectScrollbar from "react-perfect-scrollbar";
import Page from "../../components/Page";
import NoFoundTableBody from "../../components/NoFoundTableBody";
import CopyInvoiceButton from "./CopyInvoiceButton";
import {NavLink as RouterLink} from "react-router-dom";
import {ArrowRight as ArrowRightIcon, PlusCircle as PlusCircleIcon} from "react-feather";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    }
}));

const ListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0)
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
    }, [enqueueSnackbar, updateRows, page, size, startDate, endDate])

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
                <Grid
                    container
                    justifyContent="space-between"
                    spacing={3}
                >
                    <Grid item>
                        <Breadcrumbs
                            separator={<NavigateNextIcon fontSize="small" />}
                            aria-label="breadcrumb"
                        >
                            <Link
                                variant="body1"
                                color="inherit"
                                to="/app"
                                component={RouterLink}
                            >
                                Главная
                            </Link>
                            <Typography
                                variant="body1"
                                color="textPrimary"
                            >
                                Инвойсы
                            </Typography>
                        </Breadcrumbs>
                        <Typography
                            variant="h3"
                            color="textPrimary"
                        >
                            Все инвойсы
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            color="secondary"
                            variant="contained"
                            className={classes.action}
                            component={RouterLink}
                            to={`/app/invoices/create`}
                        >
                            <SvgIcon
                                fontSize="small"
                                className={classes.actionIcon}
                            >
                                <PlusCircleIcon />
                            </SvgIcon>
                            Добавить
                        </Button>
                    </Grid>
                </Grid>
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
                                                            <TableCell align="center">
                                                                <CopyInvoiceButton id={row.id} onCopy={invoiceService.postCopyInvoice} handleCopy={setUpdateRows} disabled={row.copy} />
                                                                <IconButton
                                                                    component={RouterLink}
                                                                    to={`/app/invoices/${row.id}/edit`}
                                                                >
                                                                    <SvgIcon fontSize="small">
                                                                        <ArrowRightIcon/>
                                                                    </SvgIcon>
                                                                </IconButton>
                                                            </TableCell>
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