import React, {useEffect, useReducer, useState} from "react";
import {
    Box,
    Card,
    Grid, IconButton,
    InputAdornment,
    makeStyles,
    SvgIcon, Table, TableBody, TableCell,
    TableHead,
    TablePagination, TableRow,
    TextField
} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";
import moment from "moment";
import {RoadDriverApplicationResponse} from "../../../model/Application";
import usePermission from "../../../hooks/usePermission";
import PERMISSIONS from "../../../constants/permissions";
import applicationService from "../../../services/Application";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {ArrowRight as ArrowRightIcon, Search as SearchIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {mapOfRoadDriverApplicationType, mapOfStatusApplication} from "../../../constants";
import DeleteButton from "../../../components/DeleteButton";
import {NavLink as RouterLink} from "react-router-dom";
import {setSelectedRoadDriver} from "../../../store/actions/applicationAction";
import {DoneAll as DoneAllIcon} from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 350
    },
    approved: {
        color: 'green',
        fontWeight: 600
    },
    statusPaid: {
        color: 'green',
        fontWeight: 600
    },
    statusWaiting: {
        color: 'red',
        fontWeight: 600
    }
}));

const RoadDriverListView: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0);
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<RoadDriverApplicationResponse[]>([])
    const [total, setTotal] = useState<number>(0)
    const canDelete = usePermission(PERMISSIONS.APPLICATION.ROAD_DRIVER.DELETE)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await applicationService.getFilteredRoadDriver(page, size, debouncedSearchTerm, startDate, endDate)

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
    }, [updateRows, enqueueSnackbar, page, size, debouncedSearchTerm, startDate, endDate])

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    }

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    }

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

    const handleDeleteRow = () => {
        setPage(1)
        setUpdateRows()
    };

    const isPaidApplication = (row: RoadDriverApplicationResponse): boolean => (row.status === 'PAID');

    return (
        <Card className={classes.root}>
            <Box py={3} px={2}>
                <Grid container spacing={2} alignItems="center">
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
                                <TableCell>Дата заявки</TableCell>
                                <TableCell>Менеджер</TableCell>
                                <TableCell>Рейс</TableCell>
                                <TableCell>Водитель</TableCell>
                                <TableCell>Остаток TJS</TableCell>
                                <TableCell>Остаток USD</TableCell>
                                <TableCell>Действие</TableCell>
                                <TableCell>Сумма</TableCell>
                                <TableCell align="center">Кассир</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Дата оплаты</TableCell>
                                <TableCell align="center" width="15%">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows?.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: RoadDriverApplicationResponse, index) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell>{row.createdDate}</TableCell>
                                            <TableCell>{row.createdByName}</TableCell>
                                            <TableCell>{row.roadId}</TableCell>
                                            <TableCell>{row.driverName}</TableCell>
                                            <TableCell>{row.balanceTjs}</TableCell>
                                            <TableCell>{row.balanceUsd}</TableCell>
                                            <TableCell>{mapOfRoadDriverApplicationType.get(row.type)}</TableCell>
                                            <TableCell>{row.actualAmount} {row.actualMoneyUnit}</TableCell>
                                            <TableCell align="center">
                                                {isPaidApplication(row) ? <DoneAllIcon className={classes.approved} /> : <CloseIcon className={classes.statusWaiting} />}
                                            </TableCell>
                                            <TableCell className={isPaidApplication(row) ? classes.statusPaid : classes.statusWaiting}>
                                                {mapOfStatusApplication.get(row.status!)}
                                            </TableCell>
                                            <TableCell>{isPaidApplication(row) ? row.updatedDate : "-"}</TableCell>
                                            <TableCell align="center">
                                                {!isPaidApplication(row) && canDelete && (
                                                    <DeleteButton
                                                        index={index}
                                                        rowId={row.id!}
                                                        onDelete={applicationService.deleteRoadDriver}
                                                        handleDelete={handleDeleteRow}
                                                    />
                                                )}
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/application/road-driver/show`}
                                                    onClick={() => dispatch(setSelectedRoadDriver(row))}
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

export default RoadDriverListView