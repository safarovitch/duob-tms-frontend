import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import TruckForm from "./TruckForm";
import {useSelector} from "react-redux";
import {Truck} from "../../../model/Road";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function RoadTruckView() {
    const classes = useStyles();
    const history = useHistory();
    const truck = useSelector((state: { selectedRoadTruck: Truck }) => state.selectedRoadTruck);

    if (!truck && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page
            className={classes.root}
            title={'Водитель'}
        >
            <Container maxWidth="md">
                <Header truck={truck}/>
                <Box mt={3}>
                    <TruckForm truck={truck}/>
                </Box>
            </Container>
        </Page>
    );
}

export default RoadTruckView;
