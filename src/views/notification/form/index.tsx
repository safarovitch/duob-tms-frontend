import React from "react";
import {Box, Button, Card, CardContent, Container, Grid, makeStyles, TextField} from "@material-ui/core";
import {useSnackbar} from "notistack";
import Page from "../../../components/Page";
import Header from "./Header";
import {Notification} from "../../../model/Notification";
import * as Yup from "yup";
import {Formik, FormikProps} from 'formik';
import notificationService from "../../../services/NotificationService";
import {useHistory} from "react-router-dom";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2)
    }
}));

const Index: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()

    const initialValues: Notification = {
        message: ''
    }

    const validationSchema = Yup.object().shape({
        message: Yup.string().max(255)
    })


    const handleAdd = async (values: Notification, formActions: { [key: string]: any }) => {
        try {
            await notificationService.postNewNotification(values)

            enqueueSnackbar('Успешно отправлен', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Page title={'Создание уведомления'}>
            <Container className={classes.root} maxWidth="md">
                <Header />
                <Box mt={3}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={
                            async (values, {
                                resetForm,
                                setErrors,
                                setStatus,
                                setSubmitting
                            }) => {
                                setSubmitting(true)
                                await handleAdd(values, {
                                    resetForm,
                                    setErrors,
                                    setStatus,
                                    setSubmitting
                                })
                            }
                        }
                    >
                        {(props: FormikProps<Notification>) => (
                            <form onSubmit={props.handleSubmit}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid
                                                item
                                                xs={12}
                                            >
                                                <TextField
                                                    error={Boolean(props.touched.message && props.errors.message)}
                                                    fullWidth
                                                    helperText={props.touched.message && props.errors.message}
                                                    label="Напишите уведомления"
                                                    name="message"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.message}
                                                    variant="outlined"
                                                    multiline
                                                    rows={4}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box mt={4} pb={1} className={classes.buttons}>
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
                                                Отправить
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Container>
        </Page>
    )
}

export default Index