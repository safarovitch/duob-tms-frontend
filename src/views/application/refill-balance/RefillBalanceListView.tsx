import React, {useEffect, useState,} from 'react';
import {
    Box,
    Card, Grid,
    IconButton, InputAdornment,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow, TextField,
} from '@material-ui/core';
import {Edit as EditIcon, ArrowRight as ArrowRightIcon, Search as SearchIcon, Trash as TrashIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {RefillBalanceApplication} from "../../../model/Application";
import {setSelectedRefillBalance} from "../../../store/actions/applicationAction";
import applicationService from "../../../services/Application";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {mapOfActionTypeApplication, mapOfStatusApplication} from "../../../constants";
import useDebounce from "../../../hooks/useDebounce";
import moment from "moment";
import ConfirmModal from "../../../components/ConfirmModal";
import usePermission from "../../../hooks/usePermission";
import PERMISSIONS from "../../../constants/permissions";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 350
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

const RefillBalanceListView: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const canEdit = usePermission(PERMISSIONS.APPLICATION.REFILL_BALANCE.EDIT)
    const canDelete = usePermission(PERMISSIONS.APPLICATION.REFILL_BALANCE.DELETE)
    const {enqueueSnackbar} = useSnackbar()
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<RefillBalanceApplication[]>([])
    const [total, setTotal] = useState<number>(0)
    const [isConfirmModalOpen, setOpen] = useState(false)
    const [selectedRow, selectRow] = useState<RefillBalanceApplication>()

    useEffect(() => {
        getRows().then(null)
    }, [page, size, debouncedSearchTerm, startDate, endDate])

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setQuery(event.target.value)
    }

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

    const handleSelectRow = (row: RefillBalanceApplication, needDispatch: boolean) => {
        selectRow(row);

        if (needDispatch) {
            dispatch(setSelectedRefillBalance(row))
        } else {
            setOpen(true)
        }
    }

    const handleDeleteRow = async (rowId: number) => {
        try {
            setOpen(false)
            setPage(1)

            await applicationService.deleteRefillBalance(rowId);

            enqueueSnackbar('Успешно удалено', {variant: 'success'})
            getRows().then(null)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const getRows = async () => {
        try {
            setLoading(true)
            setRows([])

            const result: any = await applicationService.getFilteredRefillBalances(page, size, debouncedSearchTerm, startDate, endDate)
            setRows(result.content)
            setTotal(result.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const isPaidApplication = (row: RefillBalanceApplication): boolean => row.status === 'PAID';

    return (
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
                                <TableCell>Дата заявки</TableCell>
                                <TableCell>Менеджер</TableCell>
                                <TableCell>Клиент</TableCell>
                                <TableCell>Кассир</TableCell>
                                <TableCell>Сумма</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Действие</TableCell>
                                <TableCell>Дата оплаты</TableCell>
                                <TableCell align="center" width="17%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows?.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: RefillBalanceApplication) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell>{row.createdDate}</TableCell>
                                            <TableCell>{row.employeeName}</TableCell>
                                            <TableCell>{row.client?.name}</TableCell>
                                            <TableCell>{isPaidApplication(row) ? row.casherName : "-"}
                                            </TableCell>
                                            <TableCell>{row.totalUSD} $</TableCell>
                                            <TableCell className={isPaidApplication(row) ? classes.statusPaid : classes.statusWaiting}>
                                                {mapOfStatusApplication.get(row.status!)}
                                            </TableCell>
                                            <TableCell>{mapOfActionTypeApplication.get(row.actionType)}</TableCell>
                                            <TableCell>{isPaidApplication(row) ? row.updatedDate : "-"}</TableCell>
                                            <TableCell align="center">
                                                {!isPaidApplication(row) && (
                                                    <>
                                                        {canEdit && (
                                                            <IconButton
                                                                component={RouterLink}
                                                                to={`/app/application/refill-balance/edit`}
                                                                onClick={() => handleSelectRow(row, true)}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <EditIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                        )}
                                                        {canDelete && (
                                                            <IconButton
                                                                onClick={() => handleSelectRow(row, false)}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <TrashIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                        )}
                                                    </>
                                                )}
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/application/refill-balance/show`}
                                                    onClick={() => handleSelectRow(row, true)}
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
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={'Вы уверены, что хотите удалить заявку?'}
                description={'При удалении заявки, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно эту заявку.'}
                onClose={() => setOpen(false)}
                onAccept={() => handleDeleteRow(selectedRow?.id!!)}/>
        </Card>
    )
}

export default RefillBalanceListView;
