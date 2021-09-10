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
} from '@material-ui/core';
import customerService from "../../../../services/CustomerService";
import errorMessageHandler from "../../../../utils/errorMessageHandler";

const Security: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Formik
            initialValues = {{
                oldPassword: '',
                newPassword: ''
            }}
            validationSchema = {Yup.object().shape({
                oldPassword: Yup.string().min(7).max(255),
                newPassword: Yup.string().min(7).max(255)
            })}
            onSubmit={async (values, {
                resetForm,
                setStatus,
                setSubmitting
            }) => {
                try {
                    await customerService.updatePassword(values)

                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);

                    enqueueSnackbar('Пароль обнавлен', {variant: 'success'});
                } catch (error) {
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'});
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
                    <Card>
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
                                        required
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
                                        required
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

export default Security;
