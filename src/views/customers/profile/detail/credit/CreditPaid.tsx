import React, {useState} from "react";
import {Credit, CreditPaidRequest} from "../../../../../model/Customer";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles, TextField
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../../../utils/errorMessageHandler";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import {Currency} from "../../../../../constants";

const useStyles = makeStyles(() => ({
    title: {
        marginTop: 16
    }
}));

const CreditPaid: React.FC<{ credit: Credit, index: number, canPaid: boolean, value: number, onPaid: Function, handlePaid: Function }> =
    ({credit, index, canPaid, value, onPaid, handlePaid}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [isConfirmModalOpen, setOpen] = useState(false)
    const [selectedIndex, setIndex] = useState<number>()

    const initialValues: CreditPaidRequest = {
        parentId: credit.id,
        amount: 0
    }

    const validationSchema = Yup.object().shape({
        amount: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleAccept = async (values: CreditPaidRequest, formActions: { [key: string]: any }) => {
        try {
            setOpen(false)
            setLoading(true)

            await onPaid(values)

            enqueueSnackbar(`Успешно оплачен`, {variant: 'success'})
            credit.balance -= values.amount
            handlePaid(selectedIndex, credit)
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const handleClick = (index: number) => {
        setOpen(true)
        setIndex(index)
    }

    return (
        <>
            <Box position="relative" display="inline-flex">
                <IconButton
                    style={{padding: 5}}
                    disabled={!canPaid || loading}
                    onClick={() => handleClick(index)}
                >
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                            value
                        )}%`}</Typography>
                    </Box>
                    {loading ? <CircularProgress /> : <CircularProgress variant="determinate" value={value} />}
                </IconButton>
            </Box>
            <Dialog
                open={isConfirmModalOpen}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle className={classes.title} disableTypography id="alert-dialog-title"><Typography variant="h4">Оплата кредита</Typography></DialogTitle>
                <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, {
                        resetForm,
                        setErrors,
                        setStatus,
                        setSubmitting
                    }) => {
                        setSubmitting(true)

                        await handleAccept(values, {
                            resetForm,
                            setErrors,
                            setStatus,
                            setSubmitting
                        })
                    }}
                >
                    {(props: FormikProps<CreditPaidRequest>) => (
                        <form onSubmit={props.handleSubmit}>
                            <TextField
                                error={Boolean(props.touched.amount && props.errors.amount)}
                                fullWidth
                                helperText={props.touched.amount && props.errors.amount}
                                label={`Введите сумму ${Currency.USD}`}
                                placeholder="0"
                                name="amount"
                                onBlur={props.handleBlur}
                                onChange={props.handleChange}
                                value={props.values.amount || ''}
                                variant="outlined"
                                required
                            />
                            <DialogActions>
                                <Button onClick={() => setOpen(false)} size="large" color="primary">
                                    Отмена
                                </Button>
                                <Button type="submit" size="large" color="primary" autoFocus>
                                    ОК
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreditPaid