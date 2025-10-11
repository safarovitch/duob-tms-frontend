import React from 'react';
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
    makeStyles, Typography,
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Autocomplete} from "@material-ui/lab";
import {
    OutcomeTransferWarehouseApplication,
    OutcomeTransferWarehouseFormProps
} from "../../../model/Application";
import applicationService from "../../../services/ApplicationService";
import {Currency} from "../../../constants";

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

const CreateOrEditForm: React.FC<OutcomeTransferWarehouseFormProps> = ({warehouses, warehouseSecondaryMoneyUnit}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()

    const initialValues: OutcomeTransferWarehouseApplication = {
        actualAmount: 0,
        actualMoneyUnit: Currency.USD,
        convertAmount: 0,
        convertMoneyUnit: warehouseSecondaryMoneyUnit.secondaryMoneyUnit,
        currency: warehouseSecondaryMoneyUnit.secondaryMoneyCurrency,
        totalConvertAmount: 0,
        totalAmount: 0,
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
                                <Grid item xs={12} sm={6} />
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
                                        disabled={true}
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
