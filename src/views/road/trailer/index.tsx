import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import TrailerForm from "./TrailerForm";
import {useSelector} from "react-redux";
import {Trailer} from "../../../model/Road";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function RoadTrailerView() {
    const classes = useStyles();
    const history = useHistory();
    const trailer = useSelector((state: { selectedRoadTrailer: Trailer }) => state.selectedRoadTrailer);

    if (!trailer && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Прицеп'}>
            <Container className={classes.root} maxWidth="md">
                <Header trailer={trailer}/>
                <Box mt={3}>
                    <TrailerForm trailer={trailer}/>
                </Box>
            </Container>
        </Page>
    );
}

export default RoadTrailerView;
