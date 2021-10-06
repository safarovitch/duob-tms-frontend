import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import Header from "./Header";
import CreateOrEditForm from "./CreateOrEditForm";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import LoadingLayout from "../../../components/LoadingLayout";
import {IncomeByArticleApplication} from "../../../model/Application";
import {Article} from "../../../model/Article";
import articleService from "../../../services/ArticleService";
import {ARTICLES} from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function RoadTrailerView() {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [articles, setArticles] = useState<Article[]>([])
    const incomeArticle = useSelector((state: { selectedApplicationIncomeArticle: IncomeByArticleApplication }) => state.selectedApplicationIncomeArticle)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const fetchArticles: any = await articleService.getArticles(ARTICLES.INCOME)

                setArticles(fetchArticles)
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if ((!incomeArticle && history.location.pathname.includes('edit')) || incomeArticle?.status === 'PAID') {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Приход по статьям'}>
            {articles.length > 0
                ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header incomeArticle={incomeArticle}/>
                        <Box mt={3}>
                            <CreateOrEditForm incomeArticle={incomeArticle} articles={articles} />
                        </Box>
                    </Container>
                )
                : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default RoadTrailerView;
