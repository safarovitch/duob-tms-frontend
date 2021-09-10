import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import DriverForm from "./DriverForm";
import {useSelector} from "react-redux";
import {Driver} from "../../../model/Road";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function RoadDriverView() {
    const classes = useStyles();
    const history = useHistory();
    const driver = useSelector((state: { selectedRoadDriver: Driver }) => state.selectedRoadDriver);

    if (!driver && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page
            className={classes.root}
            title={'Водитель'}
        >
            <Container maxWidth="md">
                <Header driver={driver}/>
                <Box mt={3}>
                    <DriverForm driver={driver}/>
                </Box>
            </Container>
        </Page>
    );
}

export default RoadDriverView;
