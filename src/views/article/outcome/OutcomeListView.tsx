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
import {setSelectedArticleOutcome} from "../../../store/actions/articleActions";
import articleService from "../../../services/ArticleService";
import ConfirmModal from "../../../components/ConfirmModal";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {ARTICLES} from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const OutcomeListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [articleOutcomes, setArticleOutcomes] = useState<Article[]>([]);
    const [selectedArticleOutcome, selectArticleOutcome] = useState<Article>();

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectArticleOutcome = (articleOutcome: Article, needDispatch: boolean) => {
        selectArticleOutcome(articleOutcome);

        if (needDispatch) {
            dispatch(setSelectedArticleOutcome(articleOutcome))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteArticleOutcome = async (articleOutcomeId: number) => {
        try {
            setOpen(false)
            setPage(1)

            await articleService.deleteArticle(articleOutcomeId);

            enqueueSnackbar(`Успешно удалено!`, {variant: 'success'})
            getArticleOutcomes().then(null)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    };

    const getArticleOutcomes = async () => {
        try {
            setLoading(true)
            setArticleOutcomes([])

            const result: any = await articleService.getFilteredArticles(ARTICLES.OUTCOME, page, size)
            setArticleOutcomes(result.content)
            setTotal(result.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getArticleOutcomes().then(null)
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
                            articleOutcomes?.length > 0
                                ? (
                                    <TableBody>
                                        {articleOutcomes.map((articleOutcome: Article) => (
                                            <TableRow
                                                hover
                                                key={articleOutcome.id}
                                            >
                                                <TableCell>
                                                    {articleOutcome.id}
                                                </TableCell>
                                                <TableCell>
                                                    {articleOutcome.name}
                                                </TableCell>
                                                <TableCell align="center" width="12%">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/app/article/outcome/edit`}
                                                        onClick={() => handleSelectArticleOutcome(articleOutcome, true)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <EditIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleSelectArticleOutcome(articleOutcome, false)}
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
                onAccept={() => handleDeleteArticleOutcome(selectedArticleOutcome?.id!!)}/>
        </Card>
    );
}

export default OutcomeListView;
