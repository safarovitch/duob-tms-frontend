import React, {useEffect, useState} from "react";
import Header from "./Header";
import Page from "../../components/Page";
import {
    Box,
    Card,
    Container,
    Grid,
    InputAdornment,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from "@material-ui/core";
import {Fuel, TotalBalance} from "../../model/Fuel";
import fuelService from "../../services/FuelService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import useDebounce from "../../hooks/useDebounce";
import moment from "moment";
import {Search as SearchIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import {mapOfRoles, mapOfTypeFuelTransactions} from "../../constants";
import NoFoundTableBody from "../../components/NoFoundTableBody";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 400
    },
    totalBalance: {
        paddingLeft: theme.spacing(3),
        paddingTop: theme.spacing(2),
    }
}));

const FuelListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar();
    const [fuels, setFuels] = useState<Fuel[]>([])
    const [totalBalance, setTotalBalance] = useState<TotalBalance>()
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const data: any = await fuelService.getTotalBalance()

                !cancel && setTotalBalance(data)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setFuels([])

                const data: any = await fuelService.getFilteredFuels(page, size, debouncedSearchTerm, startDate, endDate)

                if (!cancel) {
                    setFuels(data.content)
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

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setQuery(event.target.value)
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setSize(Number(event.target.value))
        setPage(1)
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1)
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
        <Page className={classes.root} title="АЗС">
            <Container maxWidth="lg">
                <Header/>
                <Box mt={3}>
                    <Card className={classes.root}>
                        <Box
                            p={2}
                            minHeight={56}
                            display="flex"
                            alignItems="center"
                        >
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
                                            <TableCell>
                                                №
                                            </TableCell>
                                            <TableCell>
                                                Дата
                                            </TableCell>
                                            <TableCell>
                                                Тип
                                            </TableCell>
                                            <TableCell>
                                                Должность
                                            </TableCell>
                                            <TableCell>
                                                Объём(л)
                                            </TableCell>
                                            <TableCell>
                                                С машины
                                            </TableCell>
                                            <TableCell>
                                                На машину
                                            </TableCell>
                                            <TableCell>
                                                Коментарии
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        fuels.length > 0
                                            ? (
                                                <TableBody>
                                                    {fuels.map((fuel: Fuel) => (
                                                        <TableRow
                                                            hover
                                                            key={fuel.id}
                                                        >
                                                            <TableCell>
                                                                {fuel.id}
                                                            </TableCell>
                                                            <TableCell>
                                                                {fuel.createdDate}
                                                            </TableCell>
                                                            <TableCell>
                                                                {fuel.type ? mapOfTypeFuelTransactions.get(fuel.type) : null}
                                                            </TableCell>
                                                            <TableCell>
                                                                {fuel.roles ? fuel.roles.map((role: string) => mapOfRoles.get(role)).join(', ') : null}
                                                            </TableCell>
                                                            <TableCell>
                                                                {fuel.volume}
                                                            </TableCell>
                                                            <TableCell>
                                                                {fuel.fromTruck || ('-')}
                                                            </TableCell>
                                                            <TableCell>
                                                                {fuel.toTruck || ('-')}
                                                            </TableCell>
                                                            <TableCell>
                                                                {fuel.description}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            )
                                            : <NoFoundTableBody loading={loading}/>
                                    }
                                </Table>
                            </Box>
                        </PerfectScrollbar>
                        <Grid container justifyContent="space-between">
                            <Grid item className={classes.totalBalance}>
                                {totalBalance && (
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            Остаток в машинах: <b>{totalBalance.fuelTrucks} л</b>
                                        </Grid>
                                        <Grid item>
                                            Остаток в складе: <b>{totalBalance.fuelBalanceWarehouse} л</b>
                                        </Grid>
                                        <Grid item>
                                            Общий остаток: <b>{totalBalance.fuelTotal} л</b>
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid item>
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
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
            </Container>
        </Page>
    )
}

export default FuelListView
