import {useEffect, useState} from "react";
import applicationService from "../../services/ApplicationService";
import {CashTotalApplicationEnum} from "../../constants";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {CashTotalApplication} from "../../model/Application";

const useCashTotal = (type: CashTotalApplicationEnum, updateRows: number, startDate: string, endDate: string, warehouseId?: number) => {
    const [cashTotal, setCashTotal] = useState<CashTotalApplication>()
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const data: any = await applicationService.getTotalCashierBalance(type, startDate, endDate, warehouseId)

                if (!cancel) setCashTotal(data)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [updateRows, enqueueSnackbar, startDate, endDate, warehouseId, type])

    return cashTotal
}

export default useCashTotal
