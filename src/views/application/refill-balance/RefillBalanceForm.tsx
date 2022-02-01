import React, {useEffect} from 'react';
import * as Yup from 'yup';
import {Formik, FormikProps} from 'formik';
import {useSnackbar} from 'notistack';
import {Box, Button, Card, CardContent, Grid, makeStyles, MenuItem, TextField, Typography,} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteSelectedRefillBalance} from "../../../store/actions/applicationAction";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Autocomplete} from "@material-ui/lab";
import {RefillBalanceApplication, RefillBalanceFormProps} from "../../../model/Application";
import applicationService from "../../../services/Application";
import {Currency, mapOfActionTypeApplication} from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2)
    },
    checkbox: {
        display: 'flex'
    },
    checkboxLabel: {
        marginTop: 8
    }
}));

const RefillBalanceForm: React.FC<RefillBalanceFormProps> = ({refillBalance, customers, warehouseSecondaryMoneyUnit}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => () => {
        dispatch(deleteSelectedRefillBalance())
    }, [dispatch])

    const initialValues: RefillBalanceApplication = {
        client: refillBalance?.client,
        clientId: refillBalance?.client?.id || 0,
        actionType: refillBalance?.actionType || '',
        actualAmount: refillBalance?.actualAmount || 0,
        actualMoneyUnit: Currency.USD,
        convertAmount: refillBalance?.convertAmount || 0,
        convertMoneyUnit: warehouseSecondaryMoneyUnit.secondaryMoneyUnit,
        currency: warehouseSecondaryMoneyUnit.secondaryMoneyCurrency,
        totalConvertAmount: Number(((refillBalance?.totalAmount || 0) - (refillBalance?.actualAmount || 0)).toFixed(2)),
        totalAmount: refillBalance?.totalAmount || 0,
        description: refillBalance?.description,
    }

    const validationSchema = Yup.object().shape({
        actualAmount: Yup.number().typeError('Значение должно быть числом'),
        convertAmount: Yup.number().typeError('Значение должно быть числом'),
        description: Yup.string().max(255)
    })

    const handleCreate = async (values: RefillBalanceApplication, formActions: { [key: string]: any }) => {
        try {
            await applicationService.postRefillBalance(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: RefillBalanceApplication, formActions: { [key: string]: any }) => {
        try {
            values.id = refillBalance?.id;

            await applicationService.updateRefillBalance(values)

            enqueueSnackbar('Успешно обновлено', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const calculateTotalAmount = (actualAmount: number, convertAmount: number) => {
        isNaN(actualAmount) && (actualAmount = 0)
        isNaN(convertAmount) && (convertAmount = 0)

        return (actualAmount + convertAmount).toFixed(2);
    }

    const calculateTotalConvertAmount = (convertAmount: number) => {
        isNaN(convertAmount) && (convertAmount = 0)
        return Number((convertAmount === 0 ? 0 : convertAmount / warehouseSecondaryMoneyUnit.secondaryMoneyCurrency).toFixed(2))
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={!refillBalance ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                refillBalance ? await handleUpdate(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleCreate(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<RefillBalanceApplication>) => (
                <form
                    onSubmit={props.handleSubmit}
                >
                    <Card className={classes.root}>
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <Autocomplete
                                        options={customers}
                                        getOptionLabel={option => option.code}
                                        getOptionSelected={(option, value) => option.code === value.code}
                                        onChange={(e, value) => {
                                            props.setFieldValue("clientId", value?.id);
                                        }}
                                        value={props.values.client}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.clientId && props.errors.clientId)}
                                                helperText={props.touched.clientId && props.errors.clientId}
                                                label="Выберите клиента"
                                                variant="outlined"
                                                onBlur={props.handleBlur}
                                                required
                                                {...params}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        select
                                        error={Boolean(props.touched.actionType && props.errors.actionType)}
                                        fullWidth
                                        helperText={props.touched.actionType && props.errors.actionType}
                                        label="Выберите действие"
                                        name="actionType"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.actionType}
                                        variant="outlined"
                                        required
                                        SelectProps={{
                                            MenuProps: {
                                                variant: "selectedMenu",
                                                anchorOrigin: {
                                                    vertical: "bottom",
                                                    horizontal: "left"
                                                },
                                                transformOrigin: {
                                                    vertical: "top",
                                                    horizontal: "left"
                                                },
                                                getContentAnchorEl: null
                                            }
                                        }}
                                    >
                                        {
                                            Array.from(mapOfActionTypeApplication).map(([key]) => (
                                                <MenuItem key={key} value={key}>{mapOfActionTypeApplication.get(key)}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.actualAmount && props.errors.actualAmount)}
                                        fullWidth
                                        helperText={props.touched.actualAmount && props.errors.actualAmount}
                                        label={`Введите сумму ${Currency.USD}`}
                                        placeholder="0"
                                        name="actualAmount"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            props.setFieldValue("totalAmount", calculateTotalAmount(Number(e.target.value), props.values.totalConvertAmount!))
                                            props.handleChange(e)
                                        }}
                                        value={props.values.actualAmount || ''}
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
                                        label={`Введите сумму ${warehouseSecondaryMoneyUnit.secondaryMoneyUnit}`}
                                        placeholder="0"
                                        name="convertAmount"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            let res = calculateTotalConvertAmount(Number(e.target.value))
                                            props.setFieldValue("totalConvertAmount", res)
                                            props.setFieldValue("totalAmount", calculateTotalAmount(Number(props.values.actualAmount), res))
                                            props.handleChange(e)
                                        }}
                                        value={props.values.convertAmount || ''}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <Typography>Курс конвертации: {warehouseSecondaryMoneyUnit.secondaryMoneyCurrency}</Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <Typography>Итого по курсу: {props.values.totalConvertAmount} {Currency.USD}</Typography>
                                    <Box pt={2}>
                                        <Typography><b>Итого: {props.values.totalAmount} {Currency.USD}</b></Typography>
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.description && props.errors.description)}
                                        fullWidth
                                        helperText={props.touched.description && props.errors.description}
                                        label="Напишите коментарии"
                                        name="description"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.description}
                                        variant="outlined"
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={2} pb={1} className={classes.buttons}>
                                <Button
                                    className={classes.cancelButton}
                                    variant="outlined"
                                    color="secondary"
                                    type="button"
                                    disabled={props.isSubmitting}
                                    onClick={() => history.go(-1)}
                                >
                                    Отмена
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={props.isSubmitting}
                                >
                                    {refillBalance ? 'Сохранить' : 'Создать'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default RefillBalanceForm;
