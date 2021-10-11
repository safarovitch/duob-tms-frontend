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
import {Trailer, TrailerFormProps, Truck} from "../../../model/Road";
import roadService from "../../../services/RoadService";
import {deleteSelectedTrailer} from "../../../store/actions/roadActions";
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


const TrailerForm: React.FC<TrailerFormProps> = ({trailer, trucks}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedTrailer())
    }, [])

    const initialValues: Trailer = {
        number: trailer?.number || '',
        truckId: trailer?.truckId,
        liftingCapacity: trailer?.liftingCapacity,
        totalBodyCapacity: trailer?.totalBodyCapacity
    }

    const validationSchema = Yup.object().shape({
        number: Yup.string().max(255),
        liftingCapacity: Yup.number().typeError('Значение должно быть числом'),
        totalBodyCapacity: Yup.number().typeError('Значение должно быть числом')
    })

    const handleAddProduct = async (values: Trailer, formActions: { [key: string]: any }) => {
        try {
            await roadService.postTrailer(values)

            enqueueSnackbar('Водитель создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateProduct = async (values: Trailer, formActions: { [key: string]: any }) => {
        try {
            values.id = trailer?.id;

            await roadService.updateTrailer(values)

            enqueueSnackbar('Водитель обновлен', {variant: 'success'});
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
            validationSchema={!trailer ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                trailer ? await handleUpdateProduct(values, {
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
            {(props: FormikProps<Trailer>) => (
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
                                    <Autocomplete
                                        options={trucks}
                                        getOptionLabel={option => option.number}
                                        value={trucks.find((truck: Truck) => truck.id === props.values.truckId)}
                                        onChange={(e, value) => {
                                            props.setFieldValue("truckId", value?.id);
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.truckId && props.errors.truckId)}
                                                helperText={props.touched.truckId && props.errors.truckId}
                                                label="Выберите машину"
                                                name="truckId"
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
                                        label="Введите Номер прицепа"
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
                                    <TextField
                                        error={Boolean(props.touched.liftingCapacity && props.errors.liftingCapacity)}
                                        fullWidth
                                        helperText={props.touched.liftingCapacity && props.errors.liftingCapacity}
                                        label="Введите грузо подъёмность (кг)"
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
                                    {trailer ? 'Сохранить' : 'Добавить'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default TrailerForm;
