import React from 'react';
import {
    Box,
    Container,
    makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import WarehouseForm from './WarehouseForm';
import Header from './Header';
import {Warehouse} from "../../../model/Warehouse";
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

function WarehouseFormView() {
    const classes = useStyles();
    const history = useHistory();
    const {id} = useParams<{id: string}>();
    const selectedWarehouse = useSelector((state: { selectedWarehouse: Warehouse }) => state.selectedWarehouse);

    if (id && !selectedWarehouse) {history.go(-1)}

    return (
        <Page
            className={classes.root}
            title={id ? 'Редактирование склада':'Создание склада'}
        >
            <Container maxWidth="md">
                <Header warehouse={selectedWarehouse} />
                <Box mt={3}>
                    <WarehouseForm warehouse={selectedWarehouse} />
                </Box>
            </Container>
        </Page>
    );
}

export default WarehouseFormView;
