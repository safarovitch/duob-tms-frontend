import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import ArticleOutcomeForm from "./ArticleOutcomeForm";
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

const ArticleOutcomeView: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const articleOutcome = useSelector((state: { selectedArticleOutcome: Article }) => state.selectedArticleOutcome);

    if (!articleOutcome && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page
            className={classes.root}
            title={'Расход'}
        >
            <Container maxWidth="md">
                <Header articleOutcome={articleOutcome}/>
                <Box mt={3}>
                    <ArticleOutcomeForm articleOutcome={articleOutcome}/>
                </Box>
            </Container>
        </Page>
    );
}

export default ArticleOutcomeView;
