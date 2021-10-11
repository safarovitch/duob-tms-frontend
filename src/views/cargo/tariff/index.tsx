import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import {useSelector} from "react-redux";
import {CargoTariff, CargoType} from "../../../model/Cargo";
import CargoTariffForm from "./CargoTariffForm";
import {useHistory} from "react-router-dom";
import {Warehouse} from "../../../model/Warehouse";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import cargoService from "../../../services/CargoService";
import warehouseService from "../../../services/WarehouseService";
import LoadingLayout from "../../../components/LoadingLayout";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function CargoTariffView() {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [cargoTypes, setCargoTypes] = useState<CargoType[]>([])
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const cargoTariff = useSelector((state: { selectedCargoTariff: CargoTariff }) => state.selectedCargoTariff)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)

                const dataCargoTypes: any = await cargoService.getAllCargoTypes();
                const dataWarehouses: any = await warehouseService.getAllWarehouse();
                setCargoTypes(dataCargoTypes)
                setWarehouses(dataWarehouses)
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (!cargoTariff && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Тарифы'}>
            {
                cargoTypes.length > 0 && warehouses.length > 0 ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Header cargoTariff={cargoTariff}/>
                        <Box mt={3}>
                            <CargoTariffForm cargoTariff={cargoTariff} cargoTypes={cargoTypes} warehouses={warehouses}/>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default CargoTariffView;
