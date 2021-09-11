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
import {Truck, TruckFormProps} from "../../../model/Road";
import roadService from "../../../services/RoadService";
import {deleteSelectedTruck} from "../../../store/actions/roadActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";

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


const TruckForm: React.FC<TruckFormProps> = (props: TruckFormProps) => {
    const {truck} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedTruck())
    }, [])

    const initialValues: Truck = {
        truckType: truck?.truckType || '',
        tankCapacity: truck?.tankCapacity,
        liftingCapacity: truck?.liftingCapacity,
        truckNumber: truck?.truckNumber || '',
        totalBodyCapacity: truck?.totalBodyCapacity,
    }

    const validationSchema = Yup.object().shape({
        truckType: Yup.string().max(255),
        tankCapacity: Yup.number().typeError('Значение должно быть числом'),
        liftingCapacity: Yup.number().typeError('Значение должно быть числом'),
        truckNumber: Yup.string().max(255),
        totalBodyCapacity: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleAddProduct = async (values: Truck, formActions: { [key: string]: any }) => {
        try {
            await roadService.postTruck(values)

            enqueueSnackbar('Машина создано', {variant: 'success'});
            history.go(-1);
        } catch (error) {
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
        } catch (error) {
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
                                        error={Boolean(props.touched.truckType && props.errors.truckType)}
                                        fullWidth
                                        helperText={props.touched.truckType && props.errors.truckType}
                                        label="Введите вид"
                                        name="truckType"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.truckType}
                                        variant="outlined"
                                        required
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
                                        error={Boolean(props.touched.truckNumber && props.errors.truckNumber)}
                                        fullWidth
                                        helperText={props.touched.truckNumber && props.errors.truckNumber}
                                        label="Введите номер машины"
                                        name="truckNumber"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.truckNumber}
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
