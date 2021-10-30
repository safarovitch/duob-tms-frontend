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
    makeStyles,
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Driver, Trailer, Truck, TruckType} from "../../../model/Road";
import roadService from "../../../services/RoadService";
import {deleteSelectedTruck} from "../../../store/actions/roadActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Autocomplete} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    root: {},
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2)
    }
}));

interface TruckFormProps {
    truck: Truck;
    truckTypes: TruckType[];
    trailers: Trailer[];
    drivers: Driver[];
}

const TruckForm: React.FC<TruckFormProps> = ({truck, truckTypes, trailers, drivers}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedTruck())
    }, [dispatch])

    const initialValues: Truck = {
        model: truck?.model || '',
        type: truck?.type,
        typeId: truck?.type?.id,
        number: truck?.number || '',
        trailer: truck?.trailer,
        trailerId: truck?.trailer?.id,
        driver: truck?.driver,
        driverId: truck?.driver?.id,
        tankCapacity: truck?.tankCapacity,
        liftingCapacity: truck?.liftingCapacity,
        totalBodyCapacity: truck?.totalBodyCapacity,
    }

    const validationSchema = Yup.object().shape({
        model: Yup.string().max(255),
        number: Yup.string().max(255),
        tankCapacity: Yup.number().typeError('Значение должно быть числом'),
        liftingCapacity: Yup.number().typeError('Значение должно быть числом'),
        totalBodyCapacity: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleAddProduct = async (values: Truck, formActions: { [key: string]: any }) => {
        try {
            await roadService.postTruck(values)

            enqueueSnackbar('Машина создано', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateProduct = async (values: Truck, formActions: { [key: string]: any }) => {
        try {
            values.id = truck?.id;

            await roadService.updateTruck(values)

            enqueueSnackbar('Машина обновлено', {variant: 'success'});
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
            validationSchema={!truck ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                truck ? await handleUpdateProduct(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleAddProduct(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<Truck>) => (
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
                                        error={Boolean(props.touched.model && props.errors.model)}
                                        fullWidth
                                        helperText={props.touched.model && props.errors.model}
                                        label="Введите модель"
                                        name="model"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.model}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Autocomplete
                                        options={truckTypes}
                                        getOptionLabel={option => option.name}
                                        getOptionSelected={(option, value) => option.name === value.name}
                                        value={truck ? props.values.type as TruckType : undefined}
                                        onChange={(e, value) => {
                                            props.setFieldValue("type", value);
                                            props.setFieldValue("typeId", value?.id);
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.typeId && props.errors.typeId)}
                                                helperText={props.touched.typeId && props.errors.typeId}
                                                label="Выберите тип машины"
                                                name="typeId"
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
                                >
                                    <TextField
                                        error={Boolean(props.touched.number && props.errors.number)}
                                        fullWidth
                                        helperText={props.touched.number && props.errors.number}
                                        label="Введите номер машины"
                                        name="number"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.number}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Autocomplete
                                        options={trailers}
                                        getOptionLabel={option => option.number}
                                        getOptionSelected={(option, value) => option.number === value.number}
                                        value={truck ? props.values.trailer as Trailer : undefined}
                                        onChange={(e, value) => {
                                            props.setFieldValue("trailer", value)
                                            props.setFieldValue("trailerId", value?.id)
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.trailerId && props.errors.trailerId)}
                                                helperText={props.touched.trailerId && props.errors.trailerId}
                                                label="Выберите прицеп"
                                                name="trailerId"
                                                variant="outlined"
                                                onBlur={props.handleBlur}
                                                {...params}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Autocomplete
                                        options={drivers}
                                        getOptionLabel={option => option.name}
                                        getOptionSelected={(option, value) => option.name === value.name}
                                        value={truck ? props.values.driver as Driver : undefined}
                                        onChange={(e, value) => {
                                            props.setFieldValue("driver", value)
                                            props.setFieldValue("driverId", value?.id)
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.driverId && props.errors.driverId)}
                                                helperText={props.touched.driverId && props.errors.driverId}
                                                label="Выберите водителя"
                                                name="driverId"
                                                variant="outlined"
                                                onBlur={props.handleBlur}
                                                {...params}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.tankCapacity && props.errors.tankCapacity)}
                                        fullWidth
                                        helperText={props.touched.tankCapacity && props.errors.tankCapacity}
                                        label="Введите объём бака (л)"
                                        name="tankCapacity"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.tankCapacity}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.liftingCapacity && props.errors.liftingCapacity)}
                                        fullWidth
                                        helperText={props.touched.liftingCapacity && props.errors.liftingCapacity}
                                        label="Введите грузоподъёмность (кг)"
                                        name="liftingCapacity"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.liftingCapacity}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.totalBodyCapacity && props.errors.totalBodyCapacity)}
                                        fullWidth
                                        helperText={props.touched.totalBodyCapacity && props.errors.totalBodyCapacity}
                                        label="Введите общий объём кузова (м3)"
                                        name="totalBodyCapacity"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.totalBodyCapacity}
                                        variant="outlined"
                                        required
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
                                    {truck ? 'Сохранить' : 'Добавить'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default TruckForm;
