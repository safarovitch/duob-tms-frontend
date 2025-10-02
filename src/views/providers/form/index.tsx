import React from 'react';
import {
    Box,
    Container,
    makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import ProviderForm from './ProviderForm';
import Header from './Header';
import {Provider} from "../../../model/Provider";
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

function ProviderFormView() {
    const classes = useStyles();
    const history = useHistory();
    const {id} = useParams<{id: string}>();
    const selectedProvider = useSelector((state: { selectedProvider: Provider }) => state.selectedProvider);

    if (id && !selectedProvider) {history.go(-1)}
    return (
        <Page
            className={classes.root}
            title={id ? 'Редактирование поставщика':'Создание поставщика'}
        >
            <Container maxWidth="md">
                <Header provider={selectedProvider} />
                <Box mt={3}>
                    <ProviderForm provider={selectedProvider} />
                </Box>
            </Container>
        </Page>
    );
}

export default ProviderFormView;
