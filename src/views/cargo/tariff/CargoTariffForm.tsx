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
    makeStyles, Container, Checkbox, Typography, MenuItem
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {CargoTariff, CargoTariffFormProps} from "../../../model/Cargo";
import cargoService from "../../../services/CargoService";
import {deleteSelectedProduct} from "../../../store/actions/cargoActions";

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


const CargoTariffForm: React.FC<CargoTariffFormProps> = (props: CargoTariffFormProps) => {
    const {className, cargoTariff} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    const [warehouses, setWarehouses] = useState()



    useEffect(() => () => {
        dispatch(deleteSelectedProduct())
    }, [])

    const initialValues: CargoTariff = {
        name: cargoTariff?.name || '',
        description: cargoTariff?.description || '',
        cubedPrice: cargoTariff?.cubedPrice || undefined,
        kgNegotiatedPrice: cargoTariff?.kgNegotiatedPrice || undefined,
        kgPrice: cargoTariff?.kgPrice || undefined,
        bottomMassInCube: cargoTariff?.bottomMassInCube || undefined,
        middleMassInCube: cargoTariff?.middleMassInCube || undefined,
        topMassInCube: cargoTariff?.topMassInCube || undefined,
        bottomDiscount: cargoTariff?.bottomDiscount || undefined,
        middleDiscount: cargoTariff?.middleDiscount || undefined,
        kgNormInCube: cargoTariff?.kgNormInCube || undefined,
        maxRoadMassInCube: cargoTariff?.maxRoadMassInCube || undefined,
        maxRoadCube: cargoTariff?.maxRoadCube || undefined,
        totalMass: cargoTariff?.totalMass || undefined,
        totalCube: cargoTariff?.totalCube || undefined,
        totalPrice: cargoTariff?.totalPrice || undefined,
        warehouseId: cargoTariff?.warehouseId || undefined,
        cargoTypeId: cargoTariff?.cargoTypeId || undefined,
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        manualPrice: Yup.boolean(),
        negotiatedPrice: Yup.boolean(),
        calculationRateWeight: Yup.boolean(),
        discount: Yup.boolean()
    })

    const handleAddCargoTariff = async (values: CargoTariff, formActions: { [key: string]: any }) => {
        try {
            formActions.setStatus({success: true});
            formActions.setSubmitting(false);
            await cargoService.postCargoTariff(values)
            enqueueSnackbar('Вид груза создан', {
                variant: 'success',
                action: <Button>ОК</Button>
            });
            history.go(-1);
            formActions.resetForm();
        } catch (error) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button>OK</Button>
            });
        }
    }

    const handleUpdateCargoTariff = async (values: CargoTariff, formActions: { [key: string]: any }) => {
        try {
            formActions.setStatus({success: true});
            formActions.setSubmitting(false);
            values.id = cargoTariff?.id;
            await cargoService.updateCargoTariff(values)
            enqueueSnackbar('Вид груза обновлено', {
                variant: 'success',
                action: <Button>ОК</Button>
            });
            history.go(-1);
        } catch (error) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button>OK</Button>
            });
        }
    }

    return (
        <Container maxWidth="sm">
            <Formik
                initialValues={initialValues}
                validationSchema={!cargoTariff ? validationSchema : null}
                onSubmit={async (values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) => {
                    setSubmitting(true)
                    cargoTariff ? await handleUpdateCargoTariff(values, {
                        resetForm,
                        setErrors,
                        setStatus,
                        setSubmitting
                    }) : await handleAddCargoTariff(values, {
                        resetForm,
                        setErrors,
                        setStatus,
                        setSubmitting
                    })
                }}
            >
                {(props: FormikProps<CargoTariff>) => (
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
                                        md={12}
                                        xs={12}
                                    >
                                        <TextField
                                            error={Boolean(props.touched.name && props.errors.name)}
                                            fullWidth
                                            helperText={props.touched.name && props.errors.name}
                                            label="Название тарифа"
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
                                        <TextField
                                            error={Boolean(props.touched.warehouseId && props.errors.warehouseId)}
                                            fullWidth
                                            helperText={props.touched.warehouseId && props.errors.warehouseId}
                                            label="Наименование груза"
                                            name="productId"
                                            select
                                            onBlur={props.handleBlur}
                                            onChange={props.handleChange}
                                            required
                                            value={props.values.warehouseId}
                                            variant="outlined"
                                        >
                                            {products.map((product) => (
                                                <MenuItem value={product.id} key={product.id}>
                                                    {product.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <label onClick={props.handleChange} className={classes.checkbox}>
                                            <Checkbox
                                                checked={props.values.negotiatedPrice}
                                                name="negotiatedPrice"
                                                color="primary"
                                                onChange={props.handleChange}
                                            />
                                            <Typography variant="subtitle1" className={classes.checkboxLabel}>
                                                Всегда использовать договорную цену
                                            </Typography>
                                        </label>
                                    </Grid>
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <label onClick={props.handleChange} className={classes.checkbox}>
                                            <Checkbox
                                                checked={props.values.calculationRateWeight}
                                                name="calculationRateWeight"
                                                color="primary"
                                                onChange={props.handleChange}
                                            />
                                            <Typography variant="subtitle1" className={classes.checkboxLabel}>
                                                Расчет по весу и норме
                                            </Typography>
                                        </label>
                                    </Grid>
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <label onClick={props.handleChange} className={classes.checkbox}>
                                            <Checkbox
                                                checked={props.values.discount}
                                                name="discount"
                                                color="primary"
                                                onChange={props.handleChange}
                                            />
                                            <Typography variant="subtitle1" className={classes.checkboxLabel}>
                                                Применять скидку
                                            </Typography>
                                        </label>
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
                                        {cargoTariff ? 'Сохранить' : 'Добавить'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </form>
                )}
            </Formik>
        </Container>
    );
}

export default CargoTariffForm;
