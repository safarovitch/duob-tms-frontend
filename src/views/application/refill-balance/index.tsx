import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import Header from "./Header";
import RefillBalanceForm from "./RefillBalanceForm";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import LoadingLayout from "../../../components/LoadingLayout";
import customerService from "../../../services/CustomerService";
import {RefillBalanceApplication} from "../../../model/Application";
import {Customer} from "../../../model/Customer";
import {Exchange} from "../../../model/Exchange";
import exchangeService from "../../../services/ExchangeService";

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
    const [hasError, setHasError] = useState(false)
    const [customers, setCustomers] = useState<Customer[]>([])
    const [exchanges, setExchanges] = useState<Exchange[]>([])
    const refillBalance = useSelector((state: { selectedRefillBalance: RefillBalanceApplication }) => state.selectedRefillBalance)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const dataCustomers: any = await customerService.getCustomers()
                const dataExchanges: any = await exchangeService.getAllExchangesWithTJS()

                if (dataCustomers.length === 0 || dataExchanges.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала клиента и курс валюты', {variant: 'info'})
                } else {
                    setCustomers(dataCustomers)
                    setExchanges(dataExchanges)
                }
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [history, enqueueSnackbar])

    if ((!refillBalance && history.location.pathname.includes('edit')) || refillBalance?.status === 'PAID') {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Пополнение баланса'}>
            {customers.length > 0 && exchanges.length > 0
                ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header refillBalance={refillBalance}/>
                        <Box mt={3}>
                            <RefillBalanceForm refillBalance={refillBalance} customers={customers} exchanges={exchanges} />
                        </Box>
                    </Container>
                )
                : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default RoadTrailerView;
