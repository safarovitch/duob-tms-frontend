import React, {useEffect, useState} from "react";
import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useSnackbar} from "notistack";
import {RoadBalanceApplicationResponse} from "../../../model/Application";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import roadService from "../../../services/RoadService";
import Page from "../../../components/Page";
import LoadingLayout from "../../../components/LoadingLayout";
import Header from "./Header";
import RoadDriverForm from "./RoadDriverForm";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const Index: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [roads, setRoads] = useState<RoadBalanceApplicationResponse[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                const data: any = await roadService.getRoadsBalance()

                if (data.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала рейс', {variant: 'info'})
                } else if (!cancel) {
                    setRoads(data)
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

    return (
        <Page title={'Рейсы и водители'}>
            {
                roads.length > 0 ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header />
                        <Box mt={3}>
                            <RoadDriverForm roads={roads} />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    )

}

export default Index;