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
import {RoadTruck} from "../../../model/Road";
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
    const [trucks, setTrucks] = useState<RoadTruck[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const fetchTrucks: any = await roadService.getActiveTrucks()

                if (fetchTrucks.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Нет свободной машины', {variant: 'info'})
                } else if (!cancel) setTrucks(fetchTrucks)
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [history, enqueueSnackbar])

    return (
        <Page title={'Рейс'}>
            {
                trucks.length > 0 ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Header />
                        <Box mt={3}>
                            <MainForm trucks={trucks} />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    )
}

export default RoadCreateView
