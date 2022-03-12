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
import {IncomeByArticleApplication, WarehouseSecondaryMoneyUnit} from "../../../model/Application";
import {Article} from "../../../model/Article";
import articleService from "../../../services/ArticleService";
import {ARTICLES} from "../../../constants";
import applicationService from "../../../services/ApplicationService";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const Index: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [articles, setArticles] = useState<Article[]>([])
    const [warehouseSecondaryMoneyUnit, setWarehouseSecondaryMoneyUnit] = useState<WarehouseSecondaryMoneyUnit>()
    const incomeArticle = useSelector((state: { selectedApplicationIncomeArticle: IncomeByArticleApplication }) => state.selectedApplicationIncomeArticle)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await articleService.getArticles(ARTICLES.INCOME)
                const dataWarehouseSecondaryMoneyUnit: any = await applicationService.getWarehouseSecondaryMoneyUnit()

                if (data.length === 0 || !dataWarehouseSecondaryMoneyUnit) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала статью и курс валюты', {variant: 'info'})
                } else if (!cancel) {
                    setArticles(data)
                    setWarehouseSecondaryMoneyUnit(dataWarehouseSecondaryMoneyUnit)
                }
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [history, enqueueSnackbar])

    if ((!incomeArticle && history.location.pathname.includes('edit')) || incomeArticle?.status === 'PAID') {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Приход по статьям'}>
            {
                articles.length > 0 && warehouseSecondaryMoneyUnit ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header incomeArticle={incomeArticle}/>
                        <Box mt={3}>
                            <CreateOrEditForm incomeArticle={incomeArticle} articles={articles} warehouseSecondaryMoneyUnit={warehouseSecondaryMoneyUnit} />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default Index;
