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
import Page from "../../../components/Page";
import {customerStuffTabs} from "../../../constants";
import {Redirect} from "react-router-dom";
import LoadingLayout from "../../../components/LoadingLayout";

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
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        if (customer === null) {
            (async () => {
                try {
                    setLoading(true)

                    const data: any = await customerService.getCustomer(userId.toString())

                    setCustomer(data)
                } catch (error: any) {
                    setHasError(true)
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                } finally {
                    setLoading(false)
                }
            })()
        }
    }, [customer, userId, enqueueSnackbar])

    if (!existStuffId(stuffId)) return <Redirect to="/404"/>

    return (
        <Page title={customer?.name || ''}>
            {
                customer ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Detail stuffId={stuffId} tabPath={'/customer'} customer={customer} />
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    )
}

export default CustomerDetail
