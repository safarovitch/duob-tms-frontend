import React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
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
} from '@material-ui/core';
import {Employee} from "../../../model/Employee";
import employeeService from "../../../services/EmployeeService";
import {useDispatch, useSelector} from "react-redux";
import {updateProfile} from "../../../store/actions/accountActions";
import {User} from "../../../model/User";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const GeneralSettings: React.FC<{employee: Employee}> = ({ employee}) =>  {
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const user = useSelector((state: {user: User}) => state.user);

    async function updateProfileState(values: Employee, formActions: { [key: string]: any }) {
        try {
            await employeeService.updateEmployee(values)
            enqueueSnackbar('Профиль обновлен', {variant: 'success'})

            dispatch(updateProfile({...user, name: values.name}))
        } catch (error: any) {
            formActions.setStatus({ success: false });
            formActions.setErrors(error.message);
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'});
        } finally {
            formActions.setSubmitting(false);
        }
    }

    const initialValues: Employee = {
        id: employee.id,
        name: user.name,
        rolesId: [],
        username: employee.username,
        password: null,
        code: employee.code,
        birthdate: employee.birthdate,
        address: employee.address,
        phoneNumber: employee.phoneNumber,
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        username: Yup.string().max(255),
        code: Yup.string().max(255),
        birthdate: Yup.string().max(255),
        address: Yup.string().max(255),
        phoneNumber: Yup.string().max(15)
    })

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                await updateProfileState(values, {
                    setErrors,
                    setStatus,
                    setSubmitting
                })

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
                    <Card>
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
