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
    const [articleIncomes, setArticleIncomes] = useState<Article[]>([]);
    const [selectedArticleIncome, selectArticleIncome] = useState<Article>();

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectArticleIncome = (articleIncome: Article, needDispatch: boolean) => {
        selectArticleIncome(articleIncome);

        if (needDispatch) {
            dispatch(setSelectedArticleIncome(articleIncome))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteArticleIncome = async (articleIncomeId: number) => {
        try {
            setOpen(false)
            setPage(1)

            await articleService.deleteArticle(articleIncomeId);

            enqueueSnackbar(`Успешно удалено!`, {variant: 'success'})
            getArticleIncomes().then(null)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    };

    const getArticleIncomes = async () => {
        try {
            setLoading(true)
            setArticleIncomes([])

            const result: any = await articleService.getFilteredArticles(ARTICLES.INCOME, page, size)
            setArticleIncomes(result.content)
            setTotal(result.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getArticleIncomes().then(null)
    }, [page, size]);

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
                                <TableCell align="center" width="12%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            articleIncomes?.length > 0
                                ? (
                                    <TableBody>
                                        {articleIncomes.map((articleIncome: Article) => (
                                            <TableRow
                                                hover
                                                key={articleIncome.id}
                                            >
                                                <TableCell>
                                                    {articleIncome.id}
                                                </TableCell>
                                                <TableCell>
                                                    {articleIncome.name}
                                                </TableCell>
                                                <TableCell align="center" width="12%">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/app/article/income/edit`}
                                                        onClick={() => handleSelectArticleIncome(articleIncome, true)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <EditIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleSelectArticleIncome(articleIncome, false)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <TrashIcon/>
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
                title={'Вы уверены, что хотите удалить статью?'}
                description={'При удалении статье, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно эту статью.'}
                onClose={() => setOpen(false)}
                onAccept={() => handleDeleteArticleIncome(selectedArticleIncome?.id!!)}/>
        </Card>
    );
}

export default IncomeListView;
