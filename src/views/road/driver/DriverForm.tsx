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
import {Driver, DriverFormProps} from "../../../model/Road";
import roadService from "../../../services/RoadService";
import {deleteSelectedDriver} from "../../../store/actions/roadActions";
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


const DriverForm: React.FC<DriverFormProps> = (props: DriverFormProps) => {
    const {driver} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedDriver())
    }, [])

    const initialValues: Driver = {
        name: driver?.name || '',
        phoneNumber: driver?.phoneNumber || '',
        address: driver?.address || ''
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        phoneNumber: Yup.string().max(255),
        address: Yup.string().max(255)
    })

    const handleAddProduct = async (values: Driver, formActions: { [key: string]: any }) => {
        try {
            await roadService.postDriver(values)

            enqueueSnackbar('Водитель создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateProduct = async (values: Driver, formActions: { [key: string]: any }) => {
        try {
            values.id = driver?.id;

            await roadService.updateDriver(values)

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
            validationSchema={!driver ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                driver ? await handleUpdateProduct(values, {
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
            {(props: FormikProps<Driver>) => (
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
                                        label="Введите название"
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
                                        error={Boolean(props.touched.phoneNumber && props.errors.phoneNumber)}
                                        fullWidth
                                        helperText={props.touched.phoneNumber && props.errors.phoneNumber}
                                        label="Введите номер телефона"
                                        name="phoneNumber"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.phoneNumber}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.address && props.errors.address)}
                                        fullWidth
                                        helperText={props.touched.address && props.errors.address}
                                        label="Введите адрес проживание"
                                        name="address"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.address}
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
                                    {driver ? 'Сохранить' : 'Добавить'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default DriverForm;
