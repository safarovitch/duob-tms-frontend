import React, {useEffect} from 'react';
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
    makeStyles, MenuItem,
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteSelectedRefillBalance} from "../../../store/actions/applicationAction";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Autocomplete} from "@material-ui/lab";
import {RefillBalanceApplication, RefillBalanceFormProps} from "../../../model/Application";
import applicationService from "../../../services/Application";
import {mapOfActionTypeApplication, moneyUnitApplication} from "../../../constants";

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
    }
}));

const RefillBalanceForm: React.FC<RefillBalanceFormProps> = ({refillBalance, customers}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => () => {
        dispatch(deleteSelectedRefillBalance())
    }, [])

    const initialValues: RefillBalanceApplication = {
        client: refillBalance?.client,
        clientId: refillBalance?.client?.id || 0,
        actionType: refillBalance?.actionType || '',
        amount: refillBalance?.amount || 0,
        moneyUnit: refillBalance?.moneyUnit || '',
        currency: refillBalance?.currency || 0,
        totalUSD: refillBalance?.totalUSD || 0,
        description: refillBalance?.description,
    }

    const validationSchema = Yup.object().shape({
        amount: Yup.number().typeError('Значение должно быть числом'),
        currency: Yup.number().typeError('Значение должно быть числом'),
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

    const calculateTotalUSD = (amount: number, currency: number) => {
        amount = isNaN(amount) ? 0 : amount
        currency = isNaN(currency) ? 0 : currency

        return (amount * currency).toFixed(2);
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
                                        error={Boolean(props.touched.amount && props.errors.amount)}
                                        fullWidth
                                        helperText={props.touched.amount && props.errors.amount}
                                        label="Введите сумму"
                                        name="amount"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            props.handleChange(e)
                                            props.setFieldValue("totalUSD", calculateTotalUSD(+e.target.value, props.values.currency));
                                        }}
                                        value={props.values.amount}
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
                                        error={Boolean(props.touched.moneyUnit && props.errors.moneyUnit)}
                                        fullWidth
                                        helperText={props.touched.moneyUnit && props.errors.moneyUnit}
                                        label="Выберите валюту"
                                        name="moneyUnit"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.moneyUnit}
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
                                            moneyUnitApplication.map((value, index) => (
                                                <MenuItem key={index} value={value}>{value}</MenuItem>
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
                                        error={Boolean(props.touched.currency && props.errors.currency)}
                                        fullWidth
                                        helperText={props.touched.currency && props.errors.currency}
                                        label="Введите курс конвертации"
                                        name="currency"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            props.handleChange(e)
                                            props.setFieldValue("totalUSD", calculateTotalUSD(props.values.amount, +e.target.value));
                                        }}
                                        value={props.values.currency}
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
                                        fullWidth
                                        label="ИТОГО $"
                                        value={props.values.totalUSD}
                                        variant="outlined"
                                        disabled
                                    />
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
