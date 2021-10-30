import React, {useEffect, useState} from "react";
import Detail from "./detail";
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {User} from "../../../model/User";
import customerService from "../../../services/CustomerService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Customer} from "../../../model/Customer";
import {useSnackbar} from "notistack";
import {Container, makeStyles} from "@material-ui/core";
import LoadingScreen from "../../../components/LoadingScreen";
import Page from "../../../components/Page";
import {customerStuffTabs} from "../../../constants";
import {Redirect} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const existStuffId = (stuffId: string) => {
    return customerStuffTabs.findIndex(stuff => stuff.value === stuffId) > -1
}

const CustomerDetail: React.FC = () => {
    const {enqueueSnackbar} = useSnackbar();
    const classes = useStyles()
    const {stuffId} = useParams<{stuffId: string}>()
    const {userId} = useSelector((state: {user: User}) => state.user)
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (customer === null) {
            (async () => {
                try {
                    setLoading(true)

                    const data: any = await customerService.getCustomer(userId.toString())

                    setCustomer(data)
                    setLoading(false)
                } catch (error: any) {
                    setLoading(false)
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                }
            })()
        }
    }, [customer, userId, enqueueSnackbar])

    if (!existStuffId(stuffId)) return <Redirect to="/404"/>

    return (
        <>
            {loading && <LoadingScreen />}
            {customer && (
                <Page className={classes.root}>
                    <Container maxWidth="lg">
                        <Detail stuffId={stuffId} tabPath={'/customer'} />
                    </Container>
                </Page>
            )}
        </>
    )
}

export default CustomerDetail
