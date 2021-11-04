import React, {useEffect, useState} from "react";
import {
    Box, Breadcrumbs, Card, Container, IconButton, InputAdornment, Link, makeStyles,
    SvgIcon, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography
} from "@material-ui/core";
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import employeeService from "../../../services/EmployeeService";
import {ArrowRight as ArrowRightIcon, Search as SearchIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import {NavLink as RouterLink} from "react-router-dom";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {EmployeeAccountabilityResponse} from "../../../model/Employee";
import Page from "../../../components/Page";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 350
    }
}));

const EmployeeListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<EmployeeAccountabilityResponse[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await employeeService.getFilteredEmployeeAccounts(debouncedSearchTerm)

                !cancel && setRows(data)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, debouncedSearchTerm])

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setQuery(event.target.value)
    }

    return (
        <Page className={classes.root} title={'Подотчеты'}>
            <Container maxWidth="lg">
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
                        Подотчеты
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    Подотчеты
                </Typography>
                <Box mt={3}>
                    <Card>
                        <Box py={3} pl={2}>
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
                        </Box>
                        <PerfectScrollbar>
                            <Box minWidth={700}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>№</TableCell>
                                            <TableCell>Сотрудник</TableCell>
                                            <TableCell>TJS</TableCell>
                                            <TableCell>USD</TableCell>
                                            <TableCell>Заявки подотчет</TableCell>
                                            <TableCell align="center" width="17%">Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map((row: EmployeeAccountabilityResponse, index) => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell>{++index}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.balanceTJS}</TableCell>
                                                        <TableCell>{row.balanceUSD}</TableCell>
                                                        <TableCell>{row.countOfUncheckedApplications}</TableCell>
                                                        <TableCell align="center">
                                                            <IconButton
                                                                component={RouterLink}
                                                                to={`/app/employee-accounts/${row.id}`}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <ArrowRightIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        ) : <NoFoundTableBody loading={loading}/>
                                    }
                                </Table>
                            </Box>
                        </PerfectScrollbar>
                    </Card>
                </Box>
            </Container>
        </Page>
    )
}

export default EmployeeListView