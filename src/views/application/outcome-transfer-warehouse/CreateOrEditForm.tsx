import React, {useState} from 'react';
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
    makeStyles, MenuItem, FormControlLabel, Checkbox,
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Autocomplete} from "@material-ui/lab";
import {
    OutcomeTransferWarehouseApplication,
    OutcomeTransferWarehouseFormProps
} from "../../../model/Application";
import applicationService from "../../../services/Application";
import {Currency} from "../../../constants";
import Alert from "@material-ui/lab/Alert";

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

const CreateOrEditForm: React.FC<OutcomeTransferWarehouseFormProps> = ({warehouses, exchanges}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const [errorExchange, setErrorExchange] = useState(false)

    const initialValues: OutcomeTransferWarehouseApplication = {
        actualAmount: 0,
        actualMoneyUnit: '' as Currency,
        convert: false,
        currency: 0,
        convertAmount: 0,
        description: '',
    }

    const validationSchema = Yup.object().shape({
        actualAmount: Yup.number().typeError('Значение должно быть числом'),
        description: Yup.string().max(255)
    })

    const handleCreate = async (values: OutcomeTransferWarehouseApplication, formActions: { [key: string]: any }) => {
        try {
            await applicationService.postOutcomeTransferWarehouse(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
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
            validationSchema={validationSchema}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                await handleCreate(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<OutcomeTransferWarehouseApplication>) => (
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
                                    md={4}
                                >
                                    <Autocomplete
                                        options={warehouses}
                                        getOptionLabel={option => option.name}
                                        getOptionSelected={(option, value) => option.name === value.name}
                                        onChange={(e, value) => {
                                            props.setFieldValue("toWarehouseId", value?.id);
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.toWarehouseId && props.errors.toWarehouseId)}
                                                helperText={props.touched.toWarehouseId && props.errors.toWarehouseId}
                                                label="Выберите склада"
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
                                    md={4}
                                >
                                    <TextField
                                        error={Boolean(props.touched.actualAmount && props.errors.actualAmount)}
                                        fullWidth
                                        helperText={props.touched.actualAmount && props.errors.actualAmount}
                                        label="Введите сумму"
                                        name="actualAmount"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            props.setFieldValue("convertAmount", calculateConvertAmount(Number(e.target.value), props.values.currency))
                                            props.handleChange(e)
                                        }}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                >
                                    <TextField
                                        select
                                        error={Boolean(props.touched.actualMoneyUnit && props.errors.actualMoneyUnit)}
                                        fullWidth
                                        helperText={props.touched.actualMoneyUnit && props.errors.actualMoneyUnit}
                                        label="Выберите валюту"
                                        name="actualMoneyUnit"
                                        defaultValue=""
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
                                                error={Boolean(props.touched.convertMoneyUnit && props.errors.convertMoneyUnit)}
                                                fullWidth
                                                helperText={props.touched.convertMoneyUnit && props.errors.convertMoneyUnit}
                                                label="Конвертационная валюта"
                                                name="convertMoneyUnit"
                                                onBlur={props.handleBlur}
                                                onChange={(e) => {
                                                    const currency = calculateCurrency(props.values.actualMoneyUnit, e.target.value as Currency)
                                                    props.setFieldValue('currency', currency)
                                                    props.setFieldValue("convertAmount", calculateConvertAmount(props.values.actualAmount, currency))
                                                    props.handleChange(e)
                                                }}
                                                value={props.values.convertMoneyUnit || ''}
                                                variant="outlined"
                                                required={props.values.convert}
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
                                    Создать
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default CreateOrEditForm;
