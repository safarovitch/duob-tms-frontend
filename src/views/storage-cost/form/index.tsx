import React from "react";
import {Box, Button, Card, CardContent, Container, Grid, makeStyles, TextField} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Header from "./Header";
import Page from "../../../components/Page";
import {useSnackbar} from "notistack";
import {StorageCost} from "../../../model/StorageCost";
import * as Yup from "yup";
import {Formik, FormikProps} from 'formik';
import errorMessageHandler from "../../../utils/errorMessageHandler";
import storageCost from "../../../services/StorageCostService";

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
        marginRight: theme.spacing(2),
        width: 177
    },
    buttonsWidth: {
        width: 177
    }
}));

const Index: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    const initialValues: StorageCost = {
        price: 0,
        freeTime: 0
    }

    const validationSchema = Yup.object().shape({
        price: Yup.number().typeError('Значение должно быть числом'),
        freeTime: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleAdd = async (values: StorageCost, formActions: { [key: string]: any }) => {
        try {
            await storageCost.postNewStorageCost(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Page className={classes.root} title={'Создание'}>
            <Container maxWidth="md">
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
                        {(props: FormikProps<StorageCost>) => (
                            <form onSubmit={props.handleSubmit}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                            >
                                                <TextField
                                                    error={Boolean(props.touched.price && props.errors.price)}
                                                    fullWidth
                                                    helperText={props.touched.price && props.errors.price}
                                                    label="Введите бесплатный срок хранения (день)"
                                                    placeholder="0"
                                                    name="price"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.price || ''}
                                                    variant="outlined"
                                                    required
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                            >
                                                <TextField
                                                    error={Boolean(props.touched.freeTime && props.errors.freeTime)}
                                                    fullWidth
                                                    helperText={props.touched.freeTime && props.errors.freeTime}
                                                    label="Введите стоимость хранения за сутки, м3 ($)"
                                                    placeholder="0"
                                                    name="freeTime"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.freeTime || ''}
                                                    variant="outlined"
                                                    required
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
                                                {'Сохранить'}
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