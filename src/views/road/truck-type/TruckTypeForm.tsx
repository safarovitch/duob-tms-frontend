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
import {TruckType, TruckTypeFormProps} from "../../../model/Road";
import roadService from "../../../services/RoadService";
import {deleteSelectedTruckType} from "../../../store/actions/roadActions";
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


const TruckTypeForm: React.FC<TruckTypeFormProps> = (props: TruckTypeFormProps) => {
    const {truckType} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedTruckType())
    }, [])

    const initialValues: TruckType = {
        name: truckType?.name || '',
        shippingNormWithoutCargo: truckType?.shippingNormWithoutCargo,
        shippingNormWithCargo: truckType?.shippingNormWithCargo,
        shippingNormTrailer: truckType?.shippingNormTrailer,
        returnNormWithoutCargo: truckType?.returnNormWithoutCargo,
        returnNormWithCargo: truckType?.returnNormWithCargo,
        returnNormTrailerWithCargo: truckType?.returnNormTrailerWithCargo,
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        shippingNormWithoutCargo: Yup.number().typeError('Значение должно быть числом'),
        shippingNormWithCargo: Yup.number().typeError('Значение должно быть числом'),
        shippingNormTrailer: Yup.number().typeError('Значение должно быть числом'),
        returnNormWithoutCargo: Yup.number().typeError('Значение должно быть числом'),
        returnNormWithCargo: Yup.number().typeError('Значение должно быть числом'),
        returnNormTrailerWithCargo: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleAddProduct = async (values: TruckType, formActions: { [key: string]: any }) => {
        try {
            await roadService.postTruckType(values)

            enqueueSnackbar('Тип машины создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateProduct = async (values: TruckType, formActions: { [key: string]: any }) => {
        try {
            values.id = truckType?.id;

            await roadService.updateTruckType(values)

            enqueueSnackbar('Тип машины обновлен', {variant: 'success'});
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
            validationSchema={!truckType ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                truckType ? await handleUpdateProduct(values, {
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
            {(props: FormikProps<TruckType>) => (
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
                                        label="Тип"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Введите тип машины"
                                        name="name"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.name}
                                        variant="outlined"
                                        required
                                        autoFocus
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.shippingNormWithoutCargo && props.errors.shippingNormWithoutCargo)}
                                        fullWidth
                                        helperText={props.touched.shippingNormWithoutCargo && props.errors.shippingNormWithoutCargo}
                                        label="Норма отправки без груза"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Введите коэффициент"
                                        name="shippingNormWithoutCargo"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.shippingNormWithoutCargo}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.shippingNormWithCargo && props.errors.shippingNormWithCargo)}
                                        fullWidth
                                        helperText={props.touched.shippingNormWithCargo && props.errors.shippingNormWithCargo}
                                        label="Норма отправки с грузом"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Введите коэффициент"
                                        name="shippingNormWithCargo"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.shippingNormWithCargo}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.shippingNormTrailer && props.errors.shippingNormTrailer)}
                                        fullWidth
                                        helperText={props.touched.shippingNormTrailer && props.errors.shippingNormTrailer}
                                        label="Норма прицепа отправки"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Введите коэффициент"
                                        name="shippingNormTrailer"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.shippingNormTrailer}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.returnNormWithoutCargo && props.errors.returnNormWithoutCargo)}
                                        fullWidth
                                        helperText={props.touched.returnNormWithoutCargo && props.errors.returnNormWithoutCargo}
                                        label="Норма возврата без груза"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Введите коэффициент"
                                        name="returnNormWithoutCargo"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.returnNormWithoutCargo}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.returnNormWithCargo && props.errors.returnNormWithCargo)}
                                        fullWidth
                                        helperText={props.touched.returnNormWithCargo && props.errors.returnNormWithCargo}
                                        label="Норма возврата с грузом"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Введите коэффициент"
                                        name="returnNormWithCargo"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.returnNormWithCargo}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.returnNormTrailerWithCargo && props.errors.returnNormTrailerWithCargo)}
                                        fullWidth
                                        helperText={props.touched.returnNormTrailerWithCargo && props.errors.returnNormTrailerWithCargo}
                                        label="Норма возврата прицепа с грузом"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Введите коэффициент"
                                        name="returnNormTrailerWithCargo"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.returnNormTrailerWithCargo}
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
                                    {truckType ? 'Сохранить' : 'Добавить'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default TruckTypeForm;
