import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import ArticleIncomeForm from "./ArticleIncomeForm";
import {useSelector} from "react-redux";
import {Article} from "../../../model/Article";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const ArticleIncomeView: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const articleIncome = useSelector((state: { selectedArticleIncome: Article }) => state.selectedArticleIncome);

    if (!articleIncome && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page
            className={classes.root}
            title={'Приход'}
        >
            <Container maxWidth="md">
                <Header articleIncome={articleIncome}/>
                <Box mt={3}>
                    <ArticleIncomeForm articleIncome={articleIncome}/>
                </Box>
            </Container>
        </Page>
    );
}

export default ArticleIncomeView;
