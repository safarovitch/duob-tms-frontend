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
import {Customer, CustomerFormProps} from "../../../model/Customer";
import customerService from "../../../services/CustomerService";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteSelectedCustomer} from "../../../store/actions/customerActions";
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

interface CustomerFormValues {
    name: string;
    phoneNumber: string;
    birthdate: Date | null | string;
    address: string;
    code: string;
    username: string;
    password?: string | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
                                                       className,
                                                       customer
                                                   }) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedCustomer())
    }, [dispatch])

    const initialValues: Customer = {
        name: customer?.name || '',
        phoneNumber: customer?.phoneNumber || '',
        birthdate: customer?.birthdate || null,
        address: customer?.address || '',
        code: customer?.code || '',
        username: customer?.username || '',
        password: customer?.password || undefined
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        phoneNumber: Yup.string().max(255),
        address: Yup.string().max(255),
        code: Yup.string().max(255),
        username: Yup.string().max(255),
        password: Yup.string().max(255)
    })

    const handleAddCustomer = async (values: Customer, formActions: { [key: string]: any }) => {
        try {
            await customerService.postNewCustomer(values)

            enqueueSnackbar('Клиент создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateCustomer = async (values: Customer, formActions: { [key: string]: any }) => {
        try {
            values.id = customer?.id;

            await customerService.updateCustomer(values)

            enqueueSnackbar('Клиент обновлен', {variant: 'success'})
            history.go(-1)
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
            validationSchema={!customer ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                customer ? await handleUpdateCustomer(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleAddCustomer(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<CustomerFormValues>) => (
                <form
                    className={clsx(classes.root, className)}
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
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.name && props.errors.name)}
                                        fullWidth
                                        helperText={props.touched.name && props.errors.name}
                                        label="Полное имя (ФИО)"
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
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.phoneNumber && props.errors.phoneNumber)}
                                        fullWidth
                                        helperText={props.touched.phoneNumber && props.errors.phoneNumber}
                                        label="Номер телефона"
                                        name="phoneNumber"
                                        required
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            let value = e.target.value

                                            if (!isNaN(Number(value)) && value.length > 9) return

                                            let lastSymbol = value[value.length - 1]
                                            isNaN(Number(lastSymbol)) && (value = value.slice(0, value.length - 1))
                                            props.setFieldValue("phoneNumber", value)
                                        }}
                                        value={props.values.phoneNumber}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(props.touched.birthdate && props.errors.birthdate)}
                                        fullWidth
                                        type="date"
                                        helperText={props.touched.birthdate && props.errors.birthdate}
                                        label="Дата рождение"
                                        name="birthdate"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.birthdate || ""}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.address && props.errors.address)}
                                        fullWidth
                                        helperText={props.touched.address && props.errors.address}
                                        label="Адрес проживания"
                                        name="address"
                                        required
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.address}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.username && props.errors.username)}
                                        fullWidth
                                        helperText={props.touched.username && props.errors.username}
                                        label="Имя пользователя"
                                        name="username"
                                        required
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.username}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.password && props.errors.password)}
                                        fullWidth
                                        helperText={props.touched.password && props.errors.password}
                                        label="Пароль"
                                        name="password"
                                        required={customer === undefined}
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.password}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.code && props.errors.code)}
                                        fullWidth
                                        helperText={props.touched.code && props.errors.code}
                                        label="Код клиента"
                                        name="code"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.code}
                                        variant="outlined"
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
                                    {customer ? 'Сохранить' : 'Создать'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default CustomerForm;
