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
import {KeyboardDatePicker} from "@material-ui/pickers";
import moment from "moment";
import customerService from "../../../services/CustomerService";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteSelectedCustomer} from "../../../store/actions/customerActions";

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
    birthDate: Date | null | string;
    address: string;
    code: string;
    username: string;
    password?: string;
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
    }, [])

    const initialValues: Customer = {
        name: customer?.name || '',
        phoneNumber: customer?.phoneNumber || '',
        birthDate: customer ? moment(customer?.birthDate, 'dd.MM.yyyy').toDate() : null,
        address: customer?.address || '',
        code: customer?.code || '',
        username: customer?.username || '',
        password: customer?.password || undefined
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        phoneNumber: Yup.string().max(255),
        birthDate: Yup.date().nullable(),
        address: Yup.string().max(255),
        code: Yup.string().max(255),
        username: Yup.string().max(255),
        password: Yup.string().max(255)
    })

    const handleAddCustomer = async (values: Customer, formActions: { [key: string]: any }) => {
        try {
            formActions.setStatus({success: true});
            formActions.setSubmitting(false);
            values.birthDate = moment(values.birthDate).format('DD.MM.yyyy')
            await customerService.postNewCustomer(values)
            enqueueSnackbar('Клиент создан', {
                variant: 'success',
                action: <Button onClick={() => history.push('/app/customers')}>Клиенты</Button>
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

    const handleUpdateCustomer = async (values: Customer, formActions: { [key: string]: any }) => {
        try {
            formActions.resetForm();
            formActions.setStatus({success: true});
            formActions.setSubmitting(false);
            values.birthDate = moment(values.birthDate).format('DD.MM.yyyy')
            values.id = customer?.id;
            await customerService.updateCustomer(values)
            enqueueSnackbar('Клиент обновлен', {
                variant: 'success',
                action: <Button onClick={() => history.push('/app/customers')}>Клиенты</Button>
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
                                        onChange={props.handleChange}
                                        value={props.values.phoneNumber}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <KeyboardDatePicker
                                        id="date-picker-dialog"
                                        label="Дата рождения"
                                        fullWidth
                                        required
                                        inputVariant="outlined"
                                        format="DD.MM.yyyy"
                                        value={props.values.birthDate}
                                        onChange={value => props.setFieldValue("birthDate", value)}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date"
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
                                    {customer ? 'Сохранить' : 'Добавить'}
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
