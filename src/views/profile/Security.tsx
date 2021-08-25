import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
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
import employeeService from "../../services/EmployeeService";

const useStyles = makeStyles(() => ({
    root: {}
}));

const Security: React.FC = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Formik
            initialValues={{
                oldPassword: '',
                newPassword: ''
            }}
            validationSchema={Yup.object().shape({
                oldPassword: Yup.string()
                    .min(7, 'Must be at least 7 characters')
                    .max(255)
                    .required('Обязательный'),
                newPassword: Yup.string()
                    .min(7, 'Must be at least 7 characters')
                    .max(255)
                    .required('Обязательный')
            })}
            onSubmit={async (values, {
                resetForm,
                setStatus,
                setSubmitting
            }) => {
                try {
                    await employeeService.updatePassword(values)

                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);

                    enqueueSnackbar('Пароль обнавлен', {
                        variant: 'success',
                    });

                } catch (error) {
                    enqueueSnackbar(`Произошла ошибка. ${error.response.data.title}`, {
                        variant: 'error',
                    });
                    setStatus({ success: false });
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
                  values
              }) => (
                <form onSubmit={handleSubmit}>
                    <Card
                        className={clsx(classes.root)}
                    >
                        <CardHeader title="Изменение пароля" />
                        <Divider />
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    item
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.oldPassword && errors.oldPassword)}
                                        fullWidth
                                        helperText={touched.oldPassword && errors.oldPassword}
                                        label="Старый пароль"
                                        name="oldPassword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="oldPassword"
                                        value={values.oldPassword}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(touched.newPassword && errors.newPassword)}
                                        fullWidth
                                        helperText={touched.newPassword && errors.newPassword}
                                        label="Новый пароль"
                                        name="newPassword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="password"
                                        value={values.newPassword}
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

Security.propTypes = {
    className: PropTypes.string
};

export default Security;
