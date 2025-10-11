import React from "react";
import {Box, Button, CircularProgress, makeStyles, SvgIcon} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {Download as DownloadIcon} from "react-feather";
import errorMessageHandler from "../../utils/errorMessageHandler";
import * as fileSaver from "file-saver";
import invoiceService from "../../services/InvoiceService";

const useStyles = makeStyles((theme) => ({
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-10px',
        marginLeft: '-10px',
    },
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    }
}));

interface DownloadInvoiceButtonInterface {
    invoiceId: number;
    invoiceNumber: string;
    loading: boolean;
    setLoading: Function;
    disabled: boolean;
}

const DownloadInvoiceButton: React.FC<DownloadInvoiceButtonInterface> = (props) => {
    let {invoiceId, invoiceNumber, loading, setLoading, disabled} = props
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()

    const handleClick = async () => {
        try {
            setLoading(true)

            const invoice: any = await invoiceService.generateInvoice(invoiceId)
            const fileBuffer: ArrayBuffer = await invoiceService.getInvoice(invoice.fileName) as ArrayBuffer
            const blob = new Blob([fileBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
            fileSaver.saveAs(blob, `Инвойс №${invoiceNumber}.xlsx`)

            enqueueSnackbar(`Успешно`, {variant: 'success'})
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
                variant="outlined"
                className={classes.action}
                onClick={handleClick}
                disabled={loading || disabled}
            >
                <SvgIcon fontSize="small" className={classes.actionIcon}>
                    <DownloadIcon />
                </SvgIcon>
                Скачать
            </Button>
            {loading && <CircularProgress size={20} className={classes.loadingProgress}/>}
        </Box>
    )
}
export default DownloadInvoiceButton