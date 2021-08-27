import React from 'react';
import {
    Box,
    Container,
    makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import CustomerForm from './CustomerForm';
import Header from './Header';
import {Customer} from "../../../model/Customer";
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function CustomerFormView() {
    const classes = useStyles();
    const history = useHistory();
    const {id} = useParams<{id: string}>();
    const selectedCustomer = useSelector((state: { selectedCustomer: Customer }) => state.selectedCustomer) || undefined;

    if (id && !selectedCustomer) {history.go(-1)}
    return (
        <Page
            className={classes.root}
            title={id ? 'Редактирование клиента':'Создание клиента'}
        >
            <Container maxWidth="lg">
                <Header customer={selectedCustomer} />
                <Box mt={3}>
                    <CustomerForm customer={selectedCustomer} />
                </Box>
            </Container>
        </Page>
    );
}

export default CustomerFormView;
