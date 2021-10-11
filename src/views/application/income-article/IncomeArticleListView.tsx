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
import {ArrowRight as ArrowRightIcon, Edit as EditIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {IncomeByArticleApplication} from "../../../model/Application";
import {setSelectedIncomeArticle} from "../../../store/actions/applicationAction";
import applicationService from "../../../services/Application";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {mapOfStatusApplication} from "../../../constants";
import usePermission from "../../../hooks/usePermission";
import PERMISSIONS from "../../../constants/permissions";
import DeleteButton from "../../../components/DeleteButton";

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
    const [rows, setRows] = useState<IncomeByArticleApplication[]>([])
    const canEdit = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.EDIT)
    const canDelete = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.DELETE)

    useEffect(() => {
        getRows().then(null)
    }, [page, size])

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

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleDeleteRow = async () => {
        setPage(1)
        getRows().then(null)
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
                            rows.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: IncomeByArticleApplication, index) => (
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

export default IncomeArticleListView;
