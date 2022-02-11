import React, {useState} from "react";
import {useSnackbar} from "notistack";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    makeStyles,
    SvgIcon,
    TextField,
    Typography
} from "@material-ui/core";
import {CurrencyExchange} from "../../../model/Exchange";
import * as Yup from "yup";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Formik, FormikProps} from "formik";
import {Currency} from "../../../constants";
import {Done as DoneIcon} from "@material-ui/icons";
import ConfirmModal from "../../../components/ConfirmModal";

const useStyles = makeStyles((theme) => ({
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        left: '14px',
        marginTop: '-14px',
    }
}));

interface CashierApproveProps {
    applicationId: number;
    currencyExchangeData: CurrencyExchange;
    onApprove: Function;
    handleApprove: Function;
}

const CashierApprove: React.FC<CashierApproveProps> = ({
                                                           applicationId, currencyExchangeData,
                                                           onApprove, handleApprove
                                                       }) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [isConfirmModalOpen, setOpen] = useState(false)

    const initialValues: CurrencyExchange = {
        actualAmount: currencyExchangeData.actualAmount,
        actualMoneyUnit: currencyExchangeData.actualMoneyUnit,
        convertAmount: currencyExchangeData.convertAmount,
        convertMoneyUnit: currencyExchangeData.convertMoneyUnit,
        currency: currencyExchangeData.currency,
        totalConvertAmount: Number(((currencyExchangeData.totalAmount) - (currencyExchangeData.actualAmount)).toFixed(2)),
        totalAmount: currencyExchangeData.totalAmount,
    }

    const validationSchema = Yup.object().shape({
        actualAmount: Yup.number().typeError('Значение должно быть числом'),
        convertAmount: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleAccept = async (values: CurrencyExchange, formActions: { [key: string]: any }) => {
        try {
            setOpen(false)
            setLoading(true)

            const data: any = await onApprove(applicationId, values)

            enqueueSnackbar(`Успешно подтверждено`, {variant: 'success'})
            handleApprove(data)
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const calculateActualAmount = (convertAmountUSD: number) => {
        return Number((currencyExchangeData.totalAmount - convertAmountUSD).toFixed(2))
    }

    const calculateConvertAmount = (actualAmount: number) => {
        return ((currencyExchangeData.totalAmount - actualAmount) * currencyExchangeData.currency).toFixed(2)
    }

    const calculateTotalConvertAmount = (convertAmount: number) => {
        isNaN(convertAmount) && (convertAmount = 0)
        return Number((convertAmount === 0 ? 0 : convertAmount / currencyExchangeData.currency).toFixed(2))
    }

    return (
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
            {(props: FormikProps<CurrencyExchange>) => (
                <form
                    onSubmit={props.handleSubmit}
                >
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                error={Boolean(props.touched.actualAmount && props.errors.actualAmount)}
                                fullWidth
                                helperText={props.touched.actualAmount && props.errors.actualAmount}
                                label={`Введите сумму ${currencyExchangeData.actualMoneyUnit}`}
                                placeholder="0"
                                name="actualAmount"
                                onBlur={props.handleBlur}
                                onChange={(e) => {
                                    let res = Number(calculateConvertAmount(Number(e.target.value)))

                                    if (res < 0) {
                                        props.setFieldValue("convertAmount", 0)
                                        props.setFieldValue("totalConvertAmount", 0)
                                        e.target.value = currencyExchangeData.totalAmount.toString()
                                    } else {
                                        props.setFieldValue("convertAmount", res)
                                        props.setFieldValue("totalConvertAmount", calculateTotalConvertAmount(res))
                                    }

                                    props.handleChange(e)
                                }}
                                value={props.values.actualAmount}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                error={Boolean(props.touched.convertAmount && props.errors.convertAmount)}
                                fullWidth
                                helperText={props.touched.convertAmount && props.errors.convertAmount}
                                label={`Введите сумму ${currencyExchangeData.convertMoneyUnit}`}
                                placeholder="0"
                                name="convertAmount"
                                onBlur={props.handleBlur}
                                onChange={(e) => {
                                    let totalConvertAmount = calculateTotalConvertAmount(Number(e.target.value)),
                                        actualAmount = calculateActualAmount(totalConvertAmount);

                                    if (actualAmount < 0) {
                                        e.target.value = calculateConvertAmount(0).toString()
                                        props.setFieldValue("actualAmount", 0)
                                        props.setFieldValue("totalConvertAmount", currencyExchangeData.totalAmount)
                                    } else {
                                        props.setFieldValue("actualAmount", actualAmount)
                                        props.setFieldValue("totalConvertAmount", totalConvertAmount)
                                    }

                                    props.handleChange(e)
                                }}
                                value={props.values.convertAmount}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <Typography>Курс конвертации: {currencyExchangeData.currency}</Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >
                            <Typography>Итого по курсу: {props.values.totalConvertAmount} {Currency.USD}</Typography>
                            <Box py={2}>
                                <Typography><b>Итого: {props.values.totalAmount} {Currency.USD}</b></Typography>
                            </Box>
                            <Box style={{position: 'relative'}}>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    className={classes.action}
                                    onClick={() => setOpen(true)}
                                    disabled={loading}
                                >
                                    <SvgIcon
                                        fontSize="small"
                                        className={classes.actionIcon}
                                    >
                                        {!loading && <DoneIcon />}
                                    </SvgIcon>
                                    Подтвердить
                                </Button>
                                {loading && <CircularProgress size={20} className={classes.loadingProgress} />}
                            </Box>
                        </Grid>
                    </Grid>
                    <ConfirmModal
                        isOpen={isConfirmModalOpen}
                        title={'Вы уверены, что хотите подтвердить заявку?'}
                        description={'При подтверждении заявки, его нельзя будет отменить. Пожалуйста, убедитесь, что вы хотите подтвердить именно эту заявку.'}
                        onClose={() => setOpen(false)}
                        onAccept={props.handleSubmit}
                    />
                </form>
            )}
        </Formik>
    )
}

export default CashierApprove