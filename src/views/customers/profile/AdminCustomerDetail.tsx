import React, {useEffect, useState} from "react";
import Detail from "./detail";
import {deleteSelectedCustomer} from "../../../store/actions/customerActions";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {Customer} from "../../../model/Customer";
import customerService from "../../../services/CustomerService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import Page from "../../../components/Page";
import {Container, makeStyles} from "@material-ui/core";
import Header from "./detail/Header";
import LoadingLayout from "../../../components/LoadingLayout";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const AdminCustomerDetail: React.FC = () => {
    const {enqueueSnackbar} = useSnackbar()
    const classes = useStyles()
    const dispatch = useDispatch()
    const {id: customerId, stuffId} = useParams<{id: string, stuffId: string}>()
    const selectedCustomer = useSelector((state: {selectedCustomer: Customer}) => state.selectedCustomer)
    const [customer, setCustomer] = useState<Customer>(selectedCustomer)
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => () => {
        dispatch(deleteSelectedCustomer())
    }, [dispatch])

    useEffect(() => {
        if (customer === null) {
            (async () => {
                try {
                    setLoading(true)

                    const data: any = await customerService.getCustomer(customerId);

                    setCustomer(data)
                } catch (error: any) {
                    setHasError(true)
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                } finally {
                    setLoading(false)
                }
            })()
        }
    }, [customer, customerId, enqueueSnackbar])

    return (
        <Page title={customer?.name || ''}>
            {
                customer ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Header customerName={customer.name}/>
                        <Detail stuffId={stuffId} tabPath={`/app/customers/${customerId}`} />
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    )
}

export default AdminCustomerDetail
