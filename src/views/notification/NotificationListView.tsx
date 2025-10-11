import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    Container,
    Grid,
    InputAdornment,
    makeStyles,
    SvgIcon, Table, TableBody, TableCell,
    TableHead, TablePagination,
    TableRow,
    TextField
} from "@material-ui/core";
import {useSnackbar} from "notistack";
import useDebounce from "../../hooks/useDebounce";
import moment from "moment";
import {Notification} from "../../model/Notification";
import errorMessageHandler from "../../utils/errorMessageHandler";
import notificationService from "../../services/NotificationService";
import Page from "../../components/Page";
import Header from "./Header";
import {Search as SearchIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import NoFoundTableBody from "../../components/NoFoundTableBody";

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

const NotificationListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [rows, setRows] = useState<Notification[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await notificationService.getFilteredNotifications(page, size, debouncedSearchTerm, startDate, endDate)

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
    }, [enqueueSnackbar, page, size, debouncedSearchTerm, startDate, endDate])

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setQuery(event.target.value)
        setPage(1);
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
        <Page className={classes.root} title="Уведомление">
            <Container maxWidth="lg">
                <Header />
                <Box mt={3}>
                    <Card className={classes.root}>
                        <Box py={2} px={2}>
                            <Grid container spacing={4}>
                                <Grid item>
                                    <TextField
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
                                        size="small"
                                        className={classes.queryField}
                                    />
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
                        </Box>
                        <PerfectScrollbar>
                            <Box minWidth={700}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Дата отправки</TableCell>
                                            <TableCell>Уведомление</TableCell>
                                            <TableCell>Сотрудник</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map(row => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell>{row.createdDate}</TableCell>
                                                        <TableCell>{row.message}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
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
                            rowsPerPageOptions={[10, 20, 30]}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                        />
                    </Card>
                </Box>
            </Container>
        </Page>
    )
}

export default NotificationListView