import React, {useEffect, useState,} from 'react';
import {
    Box,
    Card,
    IconButton,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from '@material-ui/core';
import {ArrowRight as ArrowRightIcon, Edit as EditIcon, Trash as TrashIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {IncomeByArticleApplication} from "../../../model/Application";
import {setSelectedIncomeArticle} from "../../../store/actions/applicationAction";
import applicationService from "../../../services/Application";
import ConfirmModal from "../../../components/ConfirmModal";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {mapOfStatusApplication} from "../../../constants";
import usePermission from "../../../hooks/usePermission";
import PERMISSIONS from "../../../constants/permissions";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
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

const IncomeArticleListView: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [loading, setLoading] = useState(false)
    const [isConfirmModalOpen, setOpen] = useState(false)
    const [rows, setRows] = useState<IncomeByArticleApplication[]>([])
    const [selectedRow, selectRow] = useState<IncomeByArticleApplication>()
    const canEdit = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.EDIT)
    const canDelete = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.DELETE)

    useEffect(() => {
        getRows().then(null)
    }, [page, size])

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectRow = (row: IncomeByArticleApplication, needDispatch: boolean) => {
        selectRow(row);

        if (needDispatch) {
            dispatch(setSelectedIncomeArticle(row))
        } else {
            setOpen(true)
        }
    }

    const handleDeleteRow = async (rowId: number) => {
        try {
            setOpen(false)
            setPage(1)

            await applicationService.deleteIncomeArticle(rowId);

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

            const data: any = await applicationService.getFilteredIncomeArticles(page, size)
            setRows(data.content)
            setTotal(data.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const isPaidApplication = (row: IncomeByArticleApplication): boolean => row.status === 'PAID';

    return (
        <Card className={classes.root}>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Дата заявки</TableCell>
                                <TableCell>Менеджер</TableCell>
                                <TableCell>Кассир</TableCell>
                                <TableCell>Статья</TableCell>
                                <TableCell>Сумма</TableCell>
                                <TableCell>Валюта</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Дата оплаты</TableCell>
                                <TableCell align="center" width="17%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows.length > 0
                                ? (
                                    <TableBody>
                                        {rows.map((row: IncomeByArticleApplication) => (
                                            <TableRow hover key={row.id}>
                                                <TableCell>{row.createdDate}</TableCell>
                                                <TableCell>{row.createdBy?.name}</TableCell>
                                                <TableCell>{row.cashierName}</TableCell>
                                                <TableCell>{row.article?.name}</TableCell>
                                                <TableCell>{row.amount}</TableCell>
                                                <TableCell>{row.moneyUnit}</TableCell>
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
                                                        )
                                                    }
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/app/application/income-article/show`}
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
                                )
                                : <NoFoundTableBody loading={loading}/>
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

export default IncomeArticleListView;
