import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import {useSelector} from "react-redux";
import {TruckType} from "../../../model/Road";
import TruckTypeForm from "./TruckTypeForm";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function RoadTruckTypeView() {
    const classes = useStyles();
    const history = useHistory();
    const truckType = useSelector((state: { selectedRoadTruckType: TruckType }) => state.selectedRoadTruckType);

    if (!truckType && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page
            className={classes.root}
            title={'Тип машины'}
        >
            <Container maxWidth="md">
                <Header truckType={truckType}/>
                <Box mt={3}>
                    <TruckTypeForm truckType={truckType}/>
                </Box>
            </Container>
        </Page>
    );
}

export default RoadTruckTypeView;
