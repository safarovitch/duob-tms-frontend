import React, {useEffect, useState} from "react";
import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import Header from "./Header";
import CreateOrEditForm from "./CreateOrEditForm";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import LoadingLayout from "../../../components/LoadingLayout";
import warehouseService from "../../../services/WarehouseService";
import {Warehouse} from "../../../model/Warehouse";
import {useHistory} from "react-router-dom";
import {WarehouseSecondaryMoneyUnit} from "../../../model/Application";
import applicationService from "../../../services/ApplicationService";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const Index: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const [warehouseSecondaryMoneyUnit, setWarehouseSecondaryMoneyUnit] = useState<WarehouseSecondaryMoneyUnit>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                const data: any = await warehouseService.getAllWarehouse()
                const dataWarehouseSecondaryMoneyUnit: any = await applicationService.getWarehouseSecondaryMoneyUnit()

                if (data.length === 0 || !dataWarehouseSecondaryMoneyUnit) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала склад и курс валюты', {variant: 'info'})
                } else if (!cancel) {
                    setWarehouses(data)
                    setWarehouseSecondaryMoneyUnit(dataWarehouseSecondaryMoneyUnit)
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
        <Page title={'Перевод денег'}>
            {
                warehouses.length > 0 && warehouseSecondaryMoneyUnit ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header/>
                        <Box mt={3}>
                            <CreateOrEditForm
                                warehouses={warehouses}
                                warehouseSecondaryMoneyUnit={warehouseSecondaryMoneyUnit}
                            />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default Index;
