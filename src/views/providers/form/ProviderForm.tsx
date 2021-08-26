import React, {useEffect} from 'react';
import clsx from 'clsx';
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
    makeStyles
} from '@material-ui/core';
import {Provider, ProviderFormProps} from "../../../model/Provider";
import providerService from "../../../services/ProviderService";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteSelectedProvider} from "../../../store/actions/providerActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const useStyles = makeStyles((theme) => ({
    root: {},
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2),
        width: 177
    },
    buttonsWidth: {
        width: 177
    }
}));

interface ProviderFormValues {
    name: string;
    code: string;
    address: string;
    phoneNumber: string;
}

const ProviderForm: React.FC<ProviderFormProps> = ({className, provider}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    const initialValues: Provider = {
        name: provider?.name || '',
        code: provider?.code || '',
        address: provider?.address || '',
        phoneNumber: provider?.phoneNumber || '',
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        code: Yup.string().max(255),
        address: Yup.string().max(255),
        phoneNumber: Yup.string().max(255),
    })

    useEffect(() => () => {
        dispatch(deleteSelectedProvider())
    }, [])


    const handleAddProvider = async (values: Provider, formActions: { [key: string]: any }) => {
        try {
            await providerService.postNewProvider(values)

            enqueueSnackbar('Поставщик создан', {variant: 'success'})
            history.go(-1);
        } catch (error) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateProvider = async (values: Provider, formActions: { [key: string]: any }) => {
        try {
            values.id = provider?.id;

            await providerService.updateProvider(values)

            enqueueSnackbar('Поставщик обновлен', {variant: 'success'});
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
            validationSchema={!provider ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                provider ? await handleUpdateProvider(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleAddProvider(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<ProviderFormValues>) => (
                <form
                    className={clsx(classes.root, className)}
                    onSubmit={props.handleSubmit}
                >
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        error={Boolean(props.touched.name && props.errors.name)}
                                        fullWidth
                                        autoFocus
                                        helperText={props.touched.name && props.errors.name}
                                        label="Название"
                                        placeholder="Введите название"
                                        name="name"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.name}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={Boolean(props.touched.code && props.errors.code)}
                                        fullWidth
                                        helperText={props.touched.code && props.errors.code}
                                        label="Контактное лицо"
                                        placeholder="Введите контактное лицо"
                                        name="code"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.code}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={Boolean(props.touched.phoneNumber && props.errors.phoneNumber)}
                                        fullWidth
                                        helperText={props.touched.phoneNumber && props.errors.phoneNumber}
                                        label="Телефона"
                                        placeholder="Введите номер телефона"
                                        name="phoneNumber"
                                        required
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.phoneNumber}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={Boolean(props.touched.address && props.errors.address)}
                                        fullWidth
                                        helperText={props.touched.address && props.errors.address}
                                        label="Адрес регистрации"
                                        placeholder="Введите адрес регистрации"
                                        name="address"
                                        required
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.address}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
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
                                    className={classes.buttonsWidth}
                                >
                                    {provider ? 'Сохранить' : 'Создать'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default ProviderForm;
