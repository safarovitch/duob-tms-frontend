import {Box, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router";
import Page from "../../../components/Page";
import React, {useState} from "react";
import Header from "./Header";
import CargoTypeForm from "./CargoTariffForm";
import {useSelector} from "react-redux";
import {CargoProduct, CargoTariff, CargoType} from "../../../model/Cargo";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function CargoTariffView() {
    const classes = useStyles();
    const history = useHistory();
    const cargoTariff = useSelector((state: { cargoTariff: CargoTariff }) => state.cargoTariff);
    const {stuffId} = useParams<{ stuffId: string }>();

    return (
        <Page
            className={classes.root}
            title={'Вид груза'}
        >
            <Container maxWidth="lg">

                <Header cargoTariff={cargoTariff}/>

                <Box mt={3}>
                    <CargoTypeForm cargoType={cargoType}/>
                </Box>
            </Container>
        </Page>
    );
}

export default CargoTariffView;
