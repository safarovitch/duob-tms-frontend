import React, {useEffect, useState,} from 'react';
import {
    Box, Card, Chip, Grid, IconButton, InputAdornment, SvgIcon, Table, TableBody, TableCell,
    TableHead, TablePagination, TableRow, TextField, Typography,
} from '@material-ui/core';
import {ArrowRight as ArrowRightIcon, Edit as EditIcon, Search as SearchIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {IncomeByArticleApplication} from "../../../model/Application";
import {setSelectedIncomeArticle} from "../../../store/actions/applicationAction";
import applicationService from "../../../services/ApplicationService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {CashTotalApplicationEnum, Currency, mapOfStatusApplication} from "../../../constants";
import hasPermission from "../../../hooks/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import DeleteButton from "../../../components/DeleteButton";
import DoneIcon from "@material-ui/icons/Done";
import useCashTotal from "../useCashTotal";
import getStyles from "../getStyles";
import {withTableFilters, withTableFiltersInterface} from "../../../hoc/withTableFilters";

interface IncomeArticleProps extends withTableFiltersInterface {
    warehouseId?: number;
}

const IncomeArticleListView: React.FC<IncomeArticleProps> = (props) => {
    const {warehouseId, page, setPage, handlePageChange, size, handleRowsPerPageChange, query, debouncedSearchTerm,
        handleQueryChange, loading, setLoading, total, setTotal, updateRows, setUpdateRows, startDate,
        handleStartDateChange, endDate, handleEndDateChange, enqueueSnackbar} = props

    const classes = getStyles()
    const dispatch = useDispatch()
    const statuses = ['PAID', 'WAITING']
    const [selectedStatus, setSelectedStatus] = useState<string>('')
    const [rows, setRows] = useState<IncomeByArticleApplication[]>([])
    const canEdit = hasPermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.EDIT)
    const canDelete = hasPermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.DELETE)
    const cashTotal = useCashTotal(CashTotalApplicationEnum.ARTICLE_INCOME, updateRows, startDate, endDate, warehouseId)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await applicationService.getFilteredIncomeArticles(page, size, debouncedSearchTerm, startDate, endDate, selectedStatus)

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
    }, [setLoading, setTotal, updateRows, enqueueSnackbar, page, size, debouncedSearchTerm, startDate, endDate, selectedStatus])

    const handleSelectStatus = (status: string) => {
        if (selectedStatus === status) setSelectedStatus('')
        else setSelectedStatus(status)

        setPage(1)
    }

    const handleDeleteRow = () => {
        setPage(1)
        setUpdateRows()
    }

    const isPaidApplication = (row: IncomeByArticleApplication): boolean => (row.status === 'PAID');

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
                                <TableCell>Кассир</TableCell>
                                <TableCell>Статья</TableCell>
                                <TableCell>Сумма USD</TableCell>
                                <TableCell>Сумма</TableCell>
                                <TableCell>Курс конвертации</TableCell>
                                <TableCell>Итого</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Дата оплаты</TableCell>
                                <TableCell align="center" width="17%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: IncomeByArticleApplication, index) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell>{row.createdDate}</TableCell>
                                            <TableCell>{row.createdBy?.name || '-'}</TableCell>
                                            <TableCell>{row.cashierName || '-'}</TableCell>
                                            <TableCell>{row.article?.name}</TableCell>
                                            <TableCell>{row.actualAmount} {row.actualMoneyUnit}</TableCell>
                                            <TableCell>{row.convertAmount} {row.convertMoneyUnit}</TableCell>
                                            <TableCell>{row.currency}</TableCell>
                                            <TableCell>{row.totalAmount} {Currency.USD}</TableCell>
                                            <TableCell className={isPaidApplication(row) ? classes.statusPaid : classes.statusWaiting}>
                                                {mapOfStatusApplication.get(row.status!)}
                                            </TableCell>
                                            <TableCell>{isPaidApplication(row) ? row.updatedDate : "-"}</TableCell>
                                            <TableCell align="center">
                                                {
                                                    !isPaidApplication(row) && (
                                                        <>
                                                            {canEdit && (
                                                                <IconButton
                                                                    component={RouterLink}
                                                                    to={`/app/application/income-article/edit`}
                                                                    onClick={() => dispatch(setSelectedIncomeArticle(row))}
                                                                >
                                                                    <SvgIcon fontSize="small">
                                                                        <EditIcon/>
                                                                    </SvgIcon>
                                                                </IconButton>
                                                            )}
                                                            {canDelete && (
                                                                <DeleteButton
                                                                    index={index}
                                                                    rowId={row.id!}
                                                                    onDelete={applicationService.deleteIncomeArticle}
                                                                    handleDelete={handleDeleteRow}
                                                                />
                                                            )}
                                                        </>
                                                    )
                                                }
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/application/income-article/show`}
                                                    onClick={() => dispatch(setSelectedIncomeArticle(row))}
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

export default withTableFilters(IncomeArticleListView);
