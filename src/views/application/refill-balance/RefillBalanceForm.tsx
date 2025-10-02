import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import {Formik, FormikProps} from 'formik';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    makeStyles, MenuItem, Checkbox, FormControlLabel,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
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

const RefillBalanceForm: React.FC<RefillBalanceFormProps> = ({refillBalance, customers, exchanges}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const dispatch = useDispatch()
    const [errorExchange, setErrorExchange] = useState(false)

    useEffect(() => () => {
        dispatch(deleteSelectedRefillBalance())
    }, [dispatch])

    const initialValues: RefillBalanceApplication = {
        client: refillBalance?.client,
        clientId: refillBalance?.client?.id || 0,
        actionType: refillBalance?.actionType || '',
        actualAmount: refillBalance?.actualAmount || 0,
        actualMoneyUnit: refillBalance?.actualMoneyUnit || '',
        convert: true,
        convertMoneyUnit: 'USD' as Currency,
        currency: refillBalance?.currency || 0,
        convertAmount: refillBalance?.convertAmount || 0,
        description: refillBalance?.description,
    }

    const validationSchema = Yup.object().shape({
        actualAmount: Yup.number().typeError('Значение должно быть числом'),
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

    const calculateCurrency = (actualMoneyUnit?: Currency, convertMoneyUnit?: Currency): number => {
        const actualValue = exchanges.find((value => value.unit === actualMoneyUnit))
        const convertValue = exchanges.find((value => value.unit === convertMoneyUnit))

        if ((actualMoneyUnit && !actualValue) || (convertMoneyUnit && !convertValue)) setErrorExchange(true)
        else setErrorExchange(false)

        return Number(((actualValue ? actualValue.currency : 1) / (convertValue ? convertValue.currency : 1)).toFixed(3))
    }

    const calculateConvertAmount = (amount: number, currency: number | undefined) => ((isNaN(amount) ? 0 : amount) * (currency || 0)).toFixed(2);

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
                                        getOptionLabel={option => option.name}
                                        getOptionSelected={(option, value) => option.name === value.name}
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
                                        label="Введите сумму"
                                        placeholder="0"
                                        name="actualAmount"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            props.setFieldValue("convertAmount", calculateConvertAmount(Number(e.target.value), props.values.currency))
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
                                        select
                                        error={Boolean(props.touched.actualMoneyUnit && props.errors.actualMoneyUnit)}
                                        fullWidth
                                        helperText={props.touched.actualMoneyUnit && props.errors.actualMoneyUnit}
                                        label="Выберите валюту"
                                        name="actualMoneyUnit"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            const currency = calculateCurrency(e.target.value as Currency, props.values.convertMoneyUnit)
                                            props.setFieldValue('currency', currency)
                                            props.setFieldValue("convertAmount", calculateConvertAmount(props.values.actualAmount, currency))
                                            props.handleChange(e)
                                        }}
                                        value={props.values.actualMoneyUnit}
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
                                            Object.keys(Currency).map((value, index) => (
                                                <MenuItem key={index} value={value}>{value}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                >
                                    <FormControlLabel
                                        control={<Checkbox
                                            size="small"
                                            checked={props.values.convert}
                                            name="convert"
                                            color="primary"
                                            onChange={props.handleChange}
                                            disabled
                                        />}
                                        label="Выбрать курс конвертации"
                                    />
                                </Grid>
                                {props.values.convert && (
                                    <>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                        >
                                            <TextField
                                                select
                                                fullWidth
                                                label="Конвертационная валюта"
                                                name="convertMoneyUnit"
                                                value={props.values.convertMoneyUnit}
                                                variant="outlined"
                                                disabled
                                            >
                                                {
                                                    Object.keys(Currency).map((value, index) => (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Курс конвертации"
                                                name="currency"
                                                value={props.values.currency}
                                                disabled={true}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Итого по курсу"
                                                value={props.values.convertAmount}
                                                variant="outlined"
                                                disabled
                                            />
                                        </Grid>
                                    </>
                                )}
                                {
                                    errorExchange && (
                                        <Grid
                                            item
                                            xs={12}
                                        >
                                            <Alert severity="error">Выбранный курс не указан!</Alert>
                                        </Grid>
                                    )
                                }
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
