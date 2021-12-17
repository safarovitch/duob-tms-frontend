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
    makeStyles, MenuItem, InputAdornment
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {CargoTariff, CargoTariffFormProps} from "../../../model/Cargo";
import cargoService from "../../../services/CargoService";
import {deleteSelectedCargoTariff} from "../../../store/actions/cargoActions";
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

const CargoTariffForm: React.FC<CargoTariffFormProps> = ({cargoTariff, warehouses}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedCargoTariff())
    }, [dispatch])

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
        maxRoadMass: cargoTariff?.maxRoadMass || undefined,
        totalMass: cargoTariff?.totalMass || undefined,
        totalCube: cargoTariff?.totalCube || undefined,
        totalPrice: cargoTariff?.totalPrice || undefined,
        warehouseId: cargoTariff?.warehouseDto?.id || undefined,
        defaultValue: cargoTariff?.defaultValue || false,
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255)
    })

    const handleAddCargoTariff = async (values: CargoTariff, formActions: { [key: string]: any }) => {
        try {
            await cargoService.postCargoTariff(values)

            enqueueSnackbar('Вид груза создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateCargoTariff = async (values: CargoTariff, formActions: { [key: string]: any }) => {
        try {
            values.id = cargoTariff?.id;

            await cargoService.updateCargoTariff(values)

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
                                        label="Филиал"
                                        name="warehouseId"
                                        select
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.warehouseId}
                                        variant="outlined"
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
                                        {warehouses.map((warehouse) => (
                                            <MenuItem value={warehouse.id} key={warehouse.id}>
                                                {warehouse.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.description && props.errors.description)}
                                        fullWidth
                                        helperText={props.touched.description && props.errors.description}
                                        label="Описание"
                                        name="description"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.description}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.totalPrice && props.touched.totalPrice)}
                                        fullWidth
                                        helperText={props.touched.totalPrice && props.errors.totalPrice}
                                        label="Сумма"
                                        name="totalPrice"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.totalPrice}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">$</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.cubedPrice && props.errors.cubedPrice)}
                                        fullWidth
                                        helperText={props.touched.cubedPrice && props.errors.cubedPrice}
                                        label="Цена за 1 м³ среднего предела"
                                        name="cubedPrice"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.cubedPrice}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">$</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.kgNegotiatedPrice && props.errors.kgNegotiatedPrice)}
                                        fullWidth
                                        helperText={props.touched.kgNegotiatedPrice && props.errors.kgNegotiatedPrice}
                                        label="Цена за 1 кг - договорная"
                                        name="kgNegotiatedPrice"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.kgNegotiatedPrice}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">$</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.kgPrice && props.errors.kgPrice)}
                                        fullWidth
                                        helperText={props.touched.kgPrice && props.errors.kgPrice}
                                        label="Цена за 1 кг - свыше среднего предела"
                                        name="kgPrice"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.kgPrice}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">$</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.bottomMassInCube && props.errors.bottomMassInCube)}
                                        fullWidth
                                        helperText={props.touched.bottomMassInCube && props.errors.bottomMassInCube}
                                        label="Нижний предел массы в 1 м³"
                                        name="bottomMassInCube"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.bottomMassInCube}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">кг</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.middleMassInCube && props.errors.middleMassInCube)}
                                        fullWidth
                                        helperText={props.touched.middleMassInCube && props.errors.middleMassInCube}
                                        label="Средний предел массы в 1 м³"
                                        name="middleMassInCube"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.middleMassInCube}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">кг</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.topMassInCube && props.errors.topMassInCube)}
                                        fullWidth
                                        helperText={props.touched.topMassInCube && props.errors.topMassInCube}
                                        label="Верхний предел массы в 1 м³"
                                        name="topMassInCube"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.topMassInCube}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">кг</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.bottomDiscount && props.errors.bottomDiscount)}
                                        fullWidth
                                        helperText={props.touched.bottomDiscount && props.errors.bottomDiscount}
                                        label="Скидка нижнего предела"
                                        name="bottomDiscount"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.bottomDiscount}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">$</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.middleDiscount && props.errors.middleDiscount)}
                                        fullWidth
                                        helperText={props.touched.middleDiscount && props.errors.middleDiscount}
                                        label="Скидка среднего предела"
                                        name="middleDiscount"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.middleDiscount}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">$</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.kgNormInCube && props.errors.kgNormInCube)}
                                        fullWidth
                                        helperText={props.touched.kgNormInCube && props.errors.kgNormInCube}
                                        label="Норма кг в 1 м³"
                                        name="kgNormInCube"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.kgNormInCube}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">кг</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.maxRoadMassInCube && props.errors.kgNormInCube)}
                                        fullWidth
                                        helperText={props.touched.maxRoadMassInCube && props.errors.maxRoadMassInCube}
                                        label="Максимальный вес 1 м³ в рейсе"
                                        name="maxRoadMassInCube"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.maxRoadMassInCube}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">кг</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.maxRoadCube && props.touched.maxRoadCube)}
                                        fullWidth
                                        helperText={props.touched.maxRoadCube && props.errors.maxRoadCube}
                                        label="Максимальная кубатура рейса"
                                        name="maxRoadCube"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.maxRoadCube}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">м³</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.maxRoadMass && props.touched.maxRoadMass)}
                                        fullWidth
                                        helperText={props.touched.maxRoadMass && props.errors.maxRoadMass}
                                        label="Максимальный вес рейса"
                                        name="maxRoadMass"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.maxRoadMass}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">кг</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.totalMass && props.touched.totalMass)}
                                        fullWidth
                                        helperText={props.touched.totalMass && props.errors.totalMass}
                                        label="Общий вес"
                                        name="totalMass"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.totalMass}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">кг</InputAdornment>)
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    xs={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.totalCube && props.touched.totalCube)}
                                        fullWidth
                                        helperText={props.touched.totalCube && props.errors.totalCube}
                                        label="Общий объем"
                                        name="totalCube"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.totalCube}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">м³</InputAdornment>)
                                        }}
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
                                    {cargoTariff ? 'Сохранить' : 'Добавить'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default CargoTariffForm;
