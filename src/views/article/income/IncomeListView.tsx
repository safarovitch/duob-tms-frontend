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
import {Edit as EditIcon, Trash as TrashIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {Article} from "../../../model/Article";
import {setSelectedArticleIncome} from "../../../store/actions/articleActions";
import articleService from "../../../services/ArticleService";
import ConfirmModal from "../../../components/ConfirmModal";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {ARTICLES} from '../../../constants';
import LoadingDeleteButton from "../../../components/LoadingDeleteButton";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const IncomeListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [rows, setRows] = useState<Article[]>([]);
    const [selectedRow, selectRow] = useState<Article>();

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectRow = (row: Article, needDispatch: boolean) => {
        selectRow(row);

        if (needDispatch) {
            dispatch(setSelectedArticleIncome(row))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteRow = async (rowId: number) => {
        try {
            setOpen(false)
            setLoading(true)

            await articleService.deleteArticle(rowId);

            setPage(1)
            getRows().then(null)
            enqueueSnackbar(`Успешно удалено!`, {variant: 'success'})
        } catch (error: any) {
            setLoading(false)
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    };

    const getRows = async () => {
        try {
            setLoading(true)
            setRows([])

            const result: any = await articleService.getFilteredArticles(ARTICLES.INCOME, page, size)
            setRows(result.content)
            setTotal(result.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getRows().then(null)
    }, [page, size]);

    const hasDeleteLoading = (id: number) => loading && selectedRow?.id === id;

    return (
        <Card
            className={classes.root}
        >
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    №
                                </TableCell>
                                <TableCell>
                                    Наименование
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows?.length > 0
                                ? (
                                    <TableBody>
                                        {rows.map((row: Article) => (
                                            <TableRow
                                                hover
                                                key={row.id}
                                            >
                                                <TableCell>
                                                    {row.id}
                                                </TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/app/article/income/edit`}
                                                        onClick={() => handleSelectRow(row, true)}
                                                        disabled={hasDeleteLoading(row.id!)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <EditIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                    <Box sx={{ m: 1, position: 'relative', display: 'inline-block' }}>
                                                        <IconButton
                                                            onClick={() => handleSelectRow(row, false)}
                                                            disabled={hasDeleteLoading(row.id!)}
                                                        >
                                                            <SvgIcon fontSize="small">
                                                                <TrashIcon/>
                                                            </SvgIcon>
                                                        </IconButton>
                                                        {hasDeleteLoading(row.id!) && <LoadingDeleteButton />}
                                                    </Box>
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
                title={'Вы уверены, что хотите удалить статью?'}
                description={'При удалении статье, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно эту статью.'}
                onClose={() => setOpen(false)}
                onAccept={() => handleDeleteRow(selectedRow?.id!!)}/>
        </Card>
    );
}

export default IncomeListView;
