import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import TrailerForm from "./TrailerForm";
import {useSelector} from "react-redux";
import {Trailer, Truck} from "../../../model/Road";
import roadService from "../../../services/RoadService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import LoadingLayout from "../../../components/LoadingLayout";

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
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false)
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const trailer = useSelector((state: { selectedRoadTrailer: Trailer }) => state.selectedRoadTrailer);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const result: any = await roadService.getTrucks()
                setTrucks(result)
            } catch (error) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (!trailer && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Прицеп'}>
            {trucks.length > 0
                ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header trailer={trailer}/>
                        <Box mt={3}>
                            <TrailerForm trailer={trailer} trucks={trucks}/>
                        </Box>
                    </Container>
                )
                : <LoadingLayout loading={loading} />
            }
        </Page>
    );
}

export default RoadTrailerView;
