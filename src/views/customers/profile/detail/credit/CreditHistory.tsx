import React, {useState} from "react";
import {
    Box,
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles,
    SvgIcon, Table, TableBody, TableCell, TableHead, TableRow,
    Typography
} from "@material-ui/core";
import {Receipt as ReceiptIcon} from "@material-ui/icons";
import {useSnackbar} from "notistack";
import {CreditPaidResponse} from "../../../../../model/Customer";
import customerService from "../../../../../services/CustomerService";
import errorMessageHandler from "../../../../../utils/errorMessageHandler";
import LoadingDeleteButton from "../../../../../components/LoadingDeleteButton";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Currency} from "../../../../../constants";

const useStyles = makeStyles(() => ({
    title: {
        marginTop: 16
    }
}));

const CreditHistory: React.FC<{creditId: number}> = ({creditId}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [rows, setRows] = useState<CreditPaidResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [isConfirmModalOpen, setOpen] = useState(false)
    const classes = useStyles()

    const getCreditHistory = async () => {
        try {
            setLoading(true)

            const data: any = await customerService.getCreditHistory(creditId)
            setRows(data)
            setOpen(true)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box sx={{m: 1, position: 'relative', display: 'inline-block'}}>
                <IconButton
                    onClick={getCreditHistory}
                    disabled={loading}
                >
                    <SvgIcon fontSize="small">
                        <ReceiptIcon />
                    </SvgIcon>
                </IconButton>
                {loading && <LoadingDeleteButton/>}
            </Box>
            <Dialog
                open={isConfirmModalOpen}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle className={classes.title} disableTypography id="alert-dialog-title"><Typography variant="h4">Итория оплаты</Typography></DialogTitle>
                <DialogContent>
                    <PerfectScrollbar>
                            <Table size="small">
                                <TableHead >
                                    <TableRow >
                                        <TableCell>Дата</TableCell>
                                        <TableCell>Сумма</TableCell>
                                        <TableCell>Менеджер</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        rows.map((row, index) => (
                                            <TableRow hover key={index}>
                                                <TableCell>{row.createdDate}</TableCell>
                                                <TableCell>{row.amount} {Currency.USD}</TableCell>
                                                <TableCell>{row.createdBy}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                    </PerfectScrollbar>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} size="large" color="primary" autoFocus>
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CreditHistory