import React, {useEffect, useReducer, useState,} from 'react';
import {
    Box, Card, Chip, Grid, IconButton, InputAdornment, SvgIcon, Table, TableBody, TableCell,
    TableHead, TablePagination, TableRow, TextField, Typography,
} from '@material-ui/core';
import {DoneAll as DoneAllIcon, Close as CloseIcon} from "@material-ui/icons";
import {ArrowRight as ArrowRightIcon, Search as SearchIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {useSnackbar} from "notistack";
import {OutcomeTransferWarehouseApplication} from "../../../model/Application";
import applicationService from "../../../services/ApplicationService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {CashTotalApplicationEnum, Currency, mapOfStatusApplication} from "../../../constants";
import hasPermission from "../../../hooks/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import {NavLink as RouterLink} from "react-router-dom";
import {setSelectedOutcomeTransferWarehouse} from "../../../store/actions/applicationAction";
import {useDispatch} from "react-redux";
import AdminApproveButton from "../components/AdminApproveButton";
import DeleteButton from "../../../components/DeleteButton";
import DoneIcon from "@material-ui/icons/Done";
import useDebounce from "../../../hooks/useDebounce";
import moment from "moment";
import useCashTotal from "../useCashTotal";
import getStyles from "../getStyles"

const OutcomeTransferWarehouseListView: React.FC<{warehouseId?: number}> = ({warehouseId}) => {
    const classes = getStyles()
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0);
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const statuses = ['PAID', 'WAITING', 'ON_ROAD']
    const [selectedStatus, setSelectedStatus] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<OutcomeTransferWarehouseApplication[]>([])
    const canDelete = hasPermission(PERMISSIONS.APPLICATION.OUTCOME_TRANSFER_WAREHOUSE.DELETE)
    const canAdminApprove = hasPermission(PERMISSIONS.APPLICATION.OUTCOME_TRANSFER_WAREHOUSE.ADMIN_APPROVE)
    const cashTotal = useCashTotal(CashTotalApplicationEnum.TRANSACTION_MONEY, updateRows, startDate, endDate, warehouseId)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await applicationService.getFilteredOutcomeTransferWarehouses(page, size, debouncedSearchTerm, startDate, endDate, selectedStatus)

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
    }, [updateRows, enqueueSnackbar, page, size, debouncedSearchTerm, startDate, endDate, selectedStatus])

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

    const handleSelectStatus = (status: string) => {
        if (selectedStatus === status) setSelectedStatus('')
        else setSelectedStatus(status)

        setPage(1)
    }

    const handleDeleteRow = () => {
        setPage(1)
        setUpdateRows()
    };

    const handleAdminApprove = (index: number) => {
        rows[index].adminApproval = true
        setRows([...rows])
    }

    const isPaidApplication = (row: OutcomeTransferWarehouseApplication): boolean => (row.status === 'PAID');

    return (
        <Card className={classes.root}>
            <Box py={3} px={2}>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Grid container spacing={2}>
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
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1}>
                            {statuses.map((status, index) => (
                                <Grid item key={index}>
                                    {selectedStatus === status ? (
                                        <Chip
                                            label={mapOfStatusApplication.get(status)}
                                            clickable
                                            color="primary"
                                            onClick={() => handleSelectStatus(status)}
                                            onDelete={() => handleSelectStatus(status)}
                                            deleteIcon={<DoneIcon />}
                                        />
                                    ) : (
                                        <Chip
                                            label={mapOfStatusApplication.get(status)}
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Дата заявки</TableCell>
                                <TableCell>Менеджер</TableCell>
                                <TableCell>Кассир отправителя</TableCell>
                                <TableCell>Кассир получателя</TableCell>
                                <TableCell>Склад</TableCell>
                                <TableCell>Сумма USD</TableCell>
                                <TableCell>Сумма</TableCell>
                                <TableCell>Курс конвертации</TableCell>
                                <TableCell>Итого</TableCell>
                                <TableCell align="center">Админ</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Дата оплаты</TableCell>
                                <TableCell align="center" width="17%">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: OutcomeTransferWarehouseApplication, index) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell>{row.createdDate}</TableCell>
                                            <TableCell>{row.createdBy?.name}</TableCell>
                                            <TableCell>{row.fromCashier?.name || '-'}</TableCell>
                                            <TableCell>{row.toCashier?.name || '-'}</TableCell>
                                            <TableCell>{row.toWarehouse?.name}</TableCell>
                                            <TableCell>{row.actualAmount} {row.actualMoneyUnit}</TableCell>
                                            <TableCell>{row.convertAmount} {row.convertMoneyUnit}</TableCell>
                                            <TableCell>{row.currency}</TableCell>
                                            <TableCell>{row.totalAmount} {Currency.USD}</TableCell>
                                            <TableCell align="center">
                                                {
                                                    row.adminApproval ? <DoneAllIcon className={classes.statusPaid} /> : (
                                                        canAdminApprove ? (
                                                            <AdminApproveButton
                                                                index={index}
                                                                rowId={row.id!}
                                                                approveAdminApplication={applicationService.approveAdminApplication}
                                                                onApprove={handleAdminApprove}
                                                            />
                                                        ) : <CloseIcon className={classes.statusWaiting} />
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell className={isPaidApplication(row) ? classes.statusPaid : classes.statusWaiting}>
                                                {mapOfStatusApplication.get(row.status!)}
                                            </TableCell>
                                            <TableCell>{isPaidApplication(row) ? row.updatedDate : "-"}</TableCell>
                                            <TableCell align="center">
                                                {
                                                    row.status === 'WAITING' && canDelete && (
                                                        <DeleteButton
                                                            index={index}
                                                            rowId={row.id!}
                                                            onDelete={applicationService.deleteOutcomeTransferWarehouse}
                                                            handleDelete={handleDeleteRow}
                                                        />
                                                    )
                                                }
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/application/outcome-transfer-warehouse/show`}
                                                    onClick={() => dispatch(setSelectedOutcomeTransferWarehouse(row))}
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
            <Grid container justifyContent="space-between">
                <Grid item className={classes.totalBalance}>
                    {cashTotal && (
                        <Grid container spacing={4}>
                            <Grid item>
                                <Typography variant="h5">
                                    Приход: <b>{cashTotal.actualAmountIncome} {Currency.USD} &nbsp; {cashTotal.convertAmountIncome} {cashTotal.convertMoneyUnit}</b>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">
                                    Расход: <b>{cashTotal.actualAmountOutcome} {Currency.USD} &nbsp; {cashTotal.convertAmountOutcome} {cashTotal.convertMoneyUnit}</b>
                                </Typography>
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
                        rowsPerPageOptions={[20, 30, 50]}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                    />
                </Grid>
            </Grid>
        </Card>
    )
}

export default OutcomeTransferWarehouseListView;
