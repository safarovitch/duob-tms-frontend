import React from "react";
import {Box, Button, CircularProgress, makeStyles} from "@material-ui/core";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {
    CargoInvoiceRequestList,
    GetListInvoiceResponse,
    UpdateInvoiceRequest
} from "../../../model/Invoice";

const useStyles = makeStyles(() => ({
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-10px',
        marginLeft: '-10px',
    }
}));

interface UpdateInvoiceButtonInterface {
    invoice: GetListInvoiceResponse;
    onUpdate: Function;
    loading: boolean;
    setLoading: Function;
    disabled: boolean
}

const UpdateInvoiceButton: React.FC<UpdateInvoiceButtonInterface> = ({invoice, onUpdate, loading, setLoading, disabled}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()

    const handleClick = async () => {
        try {
            setLoading(true)

            let cargoInvoiceRequestList: CargoInvoiceRequestList[] = []

            for (const cargoInvoice of invoice.cargoInvoiceProjection) {
                const newCargoInvoice: CargoInvoiceRequestList = {
                    id: cargoInvoice.id,
                    customCodeId: cargoInvoice.customCodeId,
                    quantity: cargoInvoice.quantity,
                    weight: cargoInvoice.weight,
                    price: cargoInvoice.price,
                    totalPrice: cargoInvoice.totalPrice,
                    ccPrice: cargoInvoice.ccPrice
                }

                cargoInvoiceRequestList.push(newCargoInvoice)
            }

            const newInvoice: UpdateInvoiceRequest = {
                id: invoice.id,
                providerId: invoice.providerId,
                receiverId: invoice.receiverId,
                percent: invoice.percent,
                number: invoice.number,
                currency: Number(invoice.currency),
                truckNumber: invoice.truckNumber,
                trailerNumber: invoice.trailerNumber,
                totalUsd: invoice.totalUsd,
                totalTjs: invoice.totalTjs,
                quantity: invoice.quantity,
                weight: invoice.weight,
                ccPriceUsd: invoice.ccPriceUsd,
                ccPriceTjs: invoice.ccPriceTjs,
                description: invoice.description,
                cargoInvoiceRequestList: cargoInvoiceRequestList
            }

            await onUpdate(newInvoice)

            enqueueSnackbar(`Успешно обновлено`, {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box style={{position: 'relative'}}>
            <Button
                color="secondary"
                variant="contained"
                onClick={handleClick}
                disabled={loading || disabled}
            >
                Сохранить
            </Button>
            {loading && <CircularProgress size={20} className={classes.loadingProgress}/>}
        </Box>
    )
}

export default UpdateInvoiceButton