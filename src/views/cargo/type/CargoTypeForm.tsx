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
    makeStyles, Checkbox, Typography, FormControlLabel
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {CargoType, CargoTypeFormProps} from "../../../model/Cargo";
import cargoService from "../../../services/CargoService";
import {deleteSelectedCargoType} from "../../../store/actions/cargoActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const useStyles = makeStyles((theme) => ({
    root: {},
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

const hasSelectedCargoType = (cargoType: CargoType) => {
    return cargoType.calculationRateWeight || cargoType.manualPrice || cargoType.negotiatedPrice
}

const CargoTypeForm: React.FC<CargoTypeFormProps> = (props: CargoTypeFormProps) => {
    const {cargoType} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();
    const [selectedCargoType, setSelectCargoType] = useState<boolean>(true)

    useEffect(() => () => {
        dispatch(deleteSelectedCargoType())
    }, [dispatch])

    const initialValues: CargoType = {
        name: cargoType?.name || '',
        manualPrice: cargoType?.manualPrice || false,
        negotiatedPrice: cargoType?.negotiatedPrice || false,
        calculationRateWeight: cargoType?.calculationRateWeight !== false,
        discount: cargoType?.discount || false,
        defaultValue: cargoType?.defaultValue || false
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        manualPrice: Yup.boolean(),
        negotiatedPrice: Yup.boolean(),
        calculationRateWeight: Yup.boolean(),
        discount: Yup.boolean()
    })

    const handleAddCargoType = async (values: CargoType, formActions: { [key: string]: any }) => {
        try {
            await cargoService.postCargoType(values)

            enqueueSnackbar('Вид груза создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateCargoType = async (values: CargoType, formActions: { [key: string]: any }) => {
        try {
            values.id = cargoType?.id;

            await cargoService.updateCargoType(values)

            enqueueSnackbar('Вид груза обновлено', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={!cargoType ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                cargoType ? await handleUpdateCargoType(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleAddCargoType(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<CargoType>) => (
                <form
                    className={classes.root}
                    onSubmit={props.handleSubmit}
                >
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.name && props.errors.name)}
                                        fullWidth
                                        helperText={props.touched.name && props.errors.name}
                                        label="Вид груза"
                                        name="name"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.name}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={props.values.manualPrice}
                                                name="manualPrice"
                                                color="primary"
                                                onChange={(e) => {
                                                    let cargoType = {...props.values}
                                                    cargoType.manualPrice = e.target.checked
                                                    setSelectCargoType(hasSelectedCargoType(cargoType))
                                                    props.setFieldValue("negotiatedPrice", false)
                                                    props.setFieldValue("calculationRateWeight", false)
                                                    props.handleChange(e)
                                                }}
                                            />
                                        }
                                        label="Ручная цена"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={props.values.negotiatedPrice}
                                                name="negotiatedPrice"
                                                color="primary"
                                                onChange={(e) => {
                                                    let cargoType = {...props.values}
                                                    cargoType.negotiatedPrice = e.target.checked
                                                    setSelectCargoType(hasSelectedCargoType(cargoType))
                                                    props.setFieldValue("manualPrice", false)
                                                    props.handleChange(e)
                                                }}
                                            />
                                        }
                                        label="Всегда использовать договорную цену"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={props.values.calculationRateWeight}
                                                name="calculationRateWeight"
                                                color="primary"
                                                onChange={(e) => {
                                                    let cargoType = {...props.values}
                                                    cargoType.calculationRateWeight = e.target.checked
                                                    setSelectCargoType(hasSelectedCargoType(cargoType))
                                                    props.setFieldValue("manualPrice", false)
                                                    props.handleChange(e)
                                                }}
                                            />
                                        }
                                        label="Расчет по весу и норме"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={props.values.discount}
                                                name="discount"
                                                color="primary"
                                                onChange={props.handleChange}
                                            />
                                        }
                                        label="Применять скидку"
                                    />
                                </Grid>
                                {
                                    !selectedCargoType && (
                                        <Grid
                                            item
                                            xs={12}
                                        >
                                            <Typography align="center" color="error">
                                                Выберите тип расчета
                                            </Typography>
                                        </Grid>
                                    )
                                }
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
                                    disabled={props.isSubmitting || !selectedCargoType}
                                >
                                    {cargoType ? 'Сохранить' : 'Добавить'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default CargoTypeForm;
