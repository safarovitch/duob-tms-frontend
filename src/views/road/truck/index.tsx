import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import TruckForm from "./TruckForm";
import {useSelector} from "react-redux";
import {Driver, Trailer, Truck, TruckType} from "../../../model/Road";
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
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [trailers, setTrailers] = useState<Trailer[]>([])
    const [drivers, setDrivers] = useState<Driver[]>([])
    const [truckTypes, setTruckTypes] = useState<TruckType[]>([])
    const truck = useSelector((state: { selectedRoadTruck: Truck }) => state.selectedRoadTruck)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const dataTruckTypes: any = await roadService.getTruckTypes()
                const dataTrailer: any = await roadService.getTrailers()
                const dataDrivers: any = await roadService.getDrivers()

                if (dataTruckTypes.length === 0 || dataTrailer.length === 0 || dataDrivers.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала тип машины, прицеп и водитель ', {variant: 'info'})
                } else if (!cancel) {
                    setTruckTypes(dataTruckTypes)
                    setTrailers(dataTrailer)
                    setDrivers(dataDrivers)
                }
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [history, enqueueSnackbar])

    if (!truck && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Машина'}>
            {
                trailers.length > 0 ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header truck={truck}/>
                        <Box mt={3}>
                            <TruckForm truck={truck} truckTypes={truckTypes} trailers={trailers} drivers={drivers}/>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    );
}

export default RoadTruckView;
