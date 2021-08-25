import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    makeStyles
} from '@material-ui/core';
import {Employee} from "../../../model/Employee";
import employeeService from "../../../services/EmployeeService";
import {useDispatch} from "react-redux";
import {updateProfile} from "../../../store/actions/accountActions";

const useStyles = makeStyles(() => ({
    root: {}
}));

const GeneralSettings: React.FC<{employee: Employee, getEmployee: Function}> = ({ employee, getEmployee}) =>  {
    const classes = useStyles()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const dispatch = useDispatch()
    const initialValues: Employee = {
        id: employee.id,
        name: employee.name,
        rolesId: [],
        username: employee.username,
        password: '',
        code: employee.code,
        birthdate: employee.birthdate,
        address: employee.address,
        phoneNumber: employee.phoneNumber,
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255).required('Name is required'),
        username: Yup.string().max(255).required('Login is required'),
        password: Yup.string().max(255),
        code: Yup.string().max(255).required('UserCode is required'),
        birthdate: Yup.string().max(255),
        address: Yup.string().max(255).required('Address is required'),
        phoneNumber: Yup.string().max(15)
    })

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                try {
                    await employeeService.updateEmployee(values)

                    resetForm();
                    setStatus({ success: true });
                    enqueueSnackbar('Профиль обновлен', {
                        variant: 'success',
                        action: key => (<Button onClick={() => {closeSnackbar(key)}}>OK</Button>)
                    })

                    getEmployee();
                    dispatch(updateProfile({name: values.name}))

                } catch (error) {
                    setStatus({ success: false });
                    setErrors(error.message);
                    enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                        variant: 'error',
                        action: <Button>OK</Button>
                    });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
              }) => (
                <form onSubmit={handleSubmit}>
                    <Card className={classes.root}>
                        <CardHeader title="Профиль" />
                        <Divider />
                        <CardContent>
                            <Grid
                                container
                                spacing={4}
                            >
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.name && errors.name)}
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        label="ФИО"
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.name}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.username && errors.username)}
                                        fullWidth
                                        helperText={touched.username && errors.username}
                                        label="Логин"
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.username}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.code && errors.code)}
                                        fullWidth
                                        helperText={touched.code && errors.code}
                                        label="Код пользователя"
                                        name="code"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.code}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.birthdate && errors.birthdate)}
                                        fullWidth
                                        type="date"
                                        helperText={touched.birthdate && errors.birthdate}
                                        label="Дата рождения"
                                        name="birthdate"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.birthdate}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.address && errors.address)}
                                        fullWidth
                                        helperText={touched.address && errors.address}
                                        label="Адрес проживание"
                                        name="address"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.address}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                        fullWidth
                                        helperText={touched.phoneNumber && errors.phoneNumber}
                                        label="Телефон"
                                        name="phoneNumber"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.phoneNumber}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <Box
                            p={2}
                            display="flex"
                            justifyContent="flex-end"
                        >
                            <Button
                                color="secondary"
                                disabled={isSubmitting}
                                type="submit"
                                variant="contained"
                            >
                                Сохранить
                            </Button>
                        </Box>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default GeneralSettings;
