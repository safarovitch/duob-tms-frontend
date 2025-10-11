import React from 'react';
import {
    Box,
    Container,
    makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import CreditForm from './CreditForm';
import Header from './Header';
import {useParams} from "react-router";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function CreditFormView() {
    const classes = useStyles();
    const {id} = useParams<{id: string}>();

    return (
        <Page
            className={classes.root}
            title={'Оформление кредита'}
        >
            <Container maxWidth="lg">
                <Header id={Number(id)}  />
                <Box mt={3}>
                    <CreditForm id={Number(id)} />
                </Box>
            </Container>
        </Page>
    );
}

export default CreditFormView;
