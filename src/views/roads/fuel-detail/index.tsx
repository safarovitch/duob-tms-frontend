import React from "react";
import {useParams} from "react-router";
import {RoadFuelDetail, RoadFuelType} from "../../../model/Road";
import {useHistory} from "react-router-dom";
import {Box, Container, makeStyles} from "@material-ui/core";
import {useSelector} from "react-redux";
import Page from "../../../components/Page";
import {roadsStuffTabs as tabs} from "../../../constants";
import Header from "./Header";
import FuelDetailForm from "./FuelDetailForm";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const getType = (type: string): (RoadFuelType | undefined) => {
    switch (type) {
        case 'on-road':
            return "ON_ROAD"
        case 'on-base':
            return "ON_BASE"
        case 'additional-outcome':
            return "ADDITIONAL_OUTCOME"
        default:
            return undefined
    }
}

const getCurrentTab = (stuffId: string) => {
    return tabs.filter(v => v.value === stuffId)[0];
}

const Index: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {id: roadId, stuffId} = useParams<{ id: string, stuffId: string }>()
    const type = getType(stuffId)
    const currentFuelDetailLabel = getCurrentTab(stuffId).label
    const roadFuelDetail = useSelector((state: { selectedRoadFuelDetail: RoadFuelDetail }) => state.selectedRoadFuelDetail);

    if (type === undefined || (!roadFuelDetail && history.location.pathname.includes('edit'))) {
        history.go(-1);
        return null;
    }

    return (
        <Page className={classes.root} title={currentFuelDetailLabel}>
            <Container maxWidth="md">
                <Header roadId={roadId} currentFuelDetailLabel={currentFuelDetailLabel} roadFuelDetail={roadFuelDetail} />
                <Box mt={3}>
                    <FuelDetailForm type={type} roadId={roadId} roadFuelDetail={roadFuelDetail} />
                </Box>
            </Container>
        </Page>
    );
}

export default Index
