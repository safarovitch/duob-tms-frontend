import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import TruckForm from "./TruckForm";
import {useSelector} from "react-redux";
import {Truck, TruckType} from "../../../model/Road";
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

function RoadTruckView() {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [truckTypes, setTruckTypes] = useState<TruckType[]>([])
    const truck = useSelector((state: { selectedRoadTruck: Truck }) => state.selectedRoadTruck);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const data: any = await roadService.getTruckTypes()
                if (data.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала тип машины', {variant: 'info'})
                } else setTruckTypes(data)
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (!truck && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Машина'}>
            {
                truckTypes.length > 0 ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header truck={truck}/>
                        <Box mt={3}>
                            <TruckForm truck={truck} truckTypes={truckTypes}/>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    );
}

export default RoadTruckView;
