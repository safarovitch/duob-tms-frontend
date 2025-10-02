import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../components/Page";
import React from "react";
import Header from "./Header";
import ExchangeListView from "./ExchangeListView";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const ExchangeView: React.FC = () => {
    const classes = useStyles();

    return (
        <Page
            className={classes.root}
            title={'Курс валют'}
        >
            <Container maxWidth="md">
                <Header title="Список"/>
                <Box mt={3}>
                    <ExchangeListView/>
                </Box>
            </Container>
        </Page>
    );
}

export default ExchangeView;
