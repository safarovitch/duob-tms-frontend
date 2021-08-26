import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import {useSelector} from "react-redux";
import { CargoTariff } from "../../../model/Cargo";
import CargoTariffForm from "./CargoTariffForm";

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
    const cargoTariff = useSelector((state: { selectedCargoTariff: CargoTariff }) => state.selectedCargoTariff);

    return (
        <Page
            className={classes.root}
            title={'Тарифы'}
        >
            <Container maxWidth="lg">

                <Header cargoTariff={cargoTariff}/>

                <Box mt={3}>
                    <CargoTariffForm cargoTariff={cargoTariff}/>
                </Box>
            </Container>
        </Page>
    );
}

export default CargoTariffView;
