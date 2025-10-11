import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import {useSelector} from "react-redux";
import {CargoTariff} from "../../../model/Cargo";
import CargoTariffForm from "./CargoTariffForm";
import {useHistory} from "react-router-dom";
import {Warehouse} from "../../../model/Warehouse";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import warehouseService from "../../../services/WarehouseService";
import LoadingLayout from "../../../components/LoadingLayout";
import cargoService from "../../../services/CargoService";

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
    const [prevDate, setPrevDate] = useState<string>()
    const cargoTariff = useSelector((state: { selectedCargoTariff: CargoTariff }) => state.selectedCargoTariff)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const dataWarehouses: any = await warehouseService.getAllWarehouse();
                let datePrevDate: any

                if (cargoTariff) {
                    datePrevDate = await cargoService.getPrevDateCargoTariff(cargoTariff.id!);
                }

                if (dataWarehouses.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала склад', {variant: 'info'})
                } else if (!cancel) {
                    setWarehouses(dataWarehouses)
                    if (cargoTariff) {
                        setPrevDate(datePrevDate)
                    }
                }
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [history, enqueueSnackbar, cargoTariff])

    if (!cargoTariff && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Тарифы'}>
            {
                warehouses.length > 0 && (cargoTariff ? prevDate : true ) ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Header cargoTariff={cargoTariff}/>
                        <Box mt={3}>
                            <CargoTariffForm cargoTariff={cargoTariff} warehouses={warehouses} prevDate={prevDate} />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default Index;
