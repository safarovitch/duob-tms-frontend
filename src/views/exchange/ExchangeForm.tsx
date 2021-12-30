import {Box, Button, Card, CardContent, Container, Grid, makeStyles, MenuItem, TextField} from "@material-ui/core";
import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Page from "../../components/Page";
import {Exchange} from "../../model/Exchange";
import Header from "./Header";
import {deleteSelectedExchange} from "../../store/actions/exchangeActions";
import * as Yup from "yup";
import {Currency} from "../../constants";
import {Formik, FormikProps} from "formik";
import errorMessageHandler from "../../utils/errorMessageHandler";
import exchangeService from "../../services/ExchangeService";
import {useSnackbar} from "notistack";

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

const ExchangeForm: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const exchange = useSelector((state: { selectedExchange: Exchange }) => state.selectedExchange);
    const currencies = Object.keys(Currency);
    currencies.splice(0, 1);

    useEffect(() => () => {
        dispatch(deleteSelectedExchange())
    }, [dispatch])

    if (!exchange && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    const initialValues: Exchange = {
        id: exchange?.id,
        unit: exchange?.unit || Currency.TJS,
        currency: exchange?.currency || 1
    }

    const validationSchema = Yup.object().shape({
        id: Yup.string().max(255),
        unit: Yup.string().max(255),
        currency: Yup.number().max(255)
    })
    const handleAddExchange = async (values: Exchange, formActions: { [key: string]: any }) => {
        try {
            await exchangeService.postNewExchange(values)

            enqueueSnackbar('Курс валют создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateExchange = async (values: Exchange, formActions: { [key: string]: any }) => {
        try {
            values.id = exchange?.id;
            await exchangeService.updateExchange(values)
            enqueueSnackbar('Курс валют обновлен', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }
    return (
        <Page
            className={classes.root}
            title={'Курс валют'}
        >
            <Container maxWidth="md">
                <Header title={exchange ? "Изменение" : "Создание"}/>
                <Box mt={3}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={!exchange ? validationSchema : null}
                        onSubmit={async (values, {
                            resetForm,
                            setErrors,
                            setStatus,
                            setSubmitting
                        }) => {
                            setSubmitting(true)
                            exchange ? await handleUpdateExchange(values, {
                                resetForm,
                                setErrors,
                                setStatus,
                                setSubmitting
                            }) : await handleAddExchange(values, {
                                resetForm,
                                setErrors,
                                setStatus,
                                setSubmitting
                            })
                        }}
                    >
                        {(props: FormikProps<Exchange>) => (
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
                                                sm={6}
                                            >
                                                <TextField
                                                    error={Boolean(props.touched.currency && props.errors.currency)}
                                                    fullWidth
                                                    helperText={props.touched.currency && props.errors.currency}
                                                    label="Введите курс относительно Сомони"
                                                    name="currency"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.currency}
                                                    variant="outlined"
                                                    required
                                                    autoFocus
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                            >
                                                <TextField
                                                    select
                                                    error={Boolean(props.touched.unit && props.errors.unit)}
                                                    fullWidth
                                                    helperText={props.touched.unit && props.errors.unit}
                                                    label="Выберите валюту"
                                                    name="unit"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.unit}
                                                    variant="outlined"
                                                    required
                                                    disabled={!!exchange}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            variant: "selectedMenu",
                                                            anchorOrigin: {
                                                                vertical: "bottom",
                                                                horizontal: "left"
                                                            },
                                                            transformOrigin: {
                                                                vertical: "top",
                                                                horizontal: "left"
                                                            },
                                                            getContentAnchorEl: null
                                                        }
                                                    }}
                                                >
                                                    {
                                                        currencies.map((value, index) => (
                                                            <MenuItem key={index} value={value}>{value}</MenuItem>
                                                        ))
                                                    }
                                                </TextField>
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
                                                {exchange ? 'Сохранить' : 'Добавить'}
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
    );
}

export default ExchangeForm;
