import React, {useEffect, useState} from "react";
import Header from "./Header";
import Page from "../../../components/Page";
import {
    Box,
    Container,
    makeStyles
} from "@material-ui/core";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {Driver, Truck} from "../../../model/Road";
import roadService from "../../../services/RoadService";
import LoadingLayout from "../../../components/LoadingLayout";
import MainForm from "./MainForm";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const RoadCreateView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [trucks, setTrucks] = useState<Truck[]>([])
    const [drivers, setDrivers] = useState<Driver[]>([])

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)

                const fetchTrucks: any = await roadService.getTrucks()
                const fetchDrivers: any = await roadService.getFilteredDrivers(1, 1000)

                if (fetchTrucks.length === 0 || fetchDrivers.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала машину и водителя', {variant: 'info'})
                } else {
                    setTrucks(fetchTrucks)
                    setDrivers(fetchDrivers.content)
                }
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <Page title={'Рейс'}>
            {
                (trucks.length > 0 && drivers.length > 0)
                    ? (
                        <Container className={classes.root} maxWidth="lg">
                            <Header />
                            <Box mt={3}>
                                <MainForm trucks={trucks} drivers={drivers} />
                            </Box>
                        </Container>
                    )
                    : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    )
}

export default RoadCreateView
