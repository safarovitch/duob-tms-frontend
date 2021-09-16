import React, {useEffect, useState} from 'react';
import {
    Box, Button, Card, CardContent, CircularProgress,
    Container, Grid,
    makeStyles, TextField
} from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {Fuel} from "../../../model/Fuel";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import fuelService from "../../../services/FuelService";
import {Autocomplete} from "@material-ui/lab";
import {Truck} from "../../../model/Road";
import roadService from "../../../services/RoadService";

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
    },
    tableProgress: {
        color: "secondary",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
    }
}));

const OutcomeForm: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [trucks, setTrucks] = useState<Truck[]>([]);

    const initialValues: Fuel = {
        volume: 0,
        description: ''
    }

    const validationSchema = Yup.object().shape({
        volume: Yup.number().typeError('Значение должно быть числом'),
        description: Yup.string().max(255),
    })

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const result: any = await roadService.getTrucks()
                setTrucks(result)
            } catch (error) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const handleOutcomeFuel = async (values: Fuel, formActions: { [key: string]: any }) => {
        try {
            await fuelService.postOutcome(values)

            enqueueSnackbar('Расход создан', {variant: 'success'});
            history.go(-1);
        } catch (error) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Page
            className={classes.root}
            title='Расход'
        >
            {loading && (<CircularProgress size={48} className={classes.tableProgress}/>)}
            {trucks.length > 0 && (
                <Container maxWidth="md">
                    <Header />
                    <Box mt={3}>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async (values, {
                                resetForm,
                                setErrors,
                                setStatus,
                                setSubmitting
                            }) => {
                                setSubmitting(true)
                                await handleOutcomeFuel(values, {
                                    resetForm,
                                    setErrors,
                                    setStatus,
                                    setSubmitting
                                })
                            }}
                        >
                            {(props: FormikProps<Fuel>) => (
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
                                                >
                                                    <Autocomplete
                                                        options={trucks}
                                                        getOptionLabel={option => option.number}
                                                        onChange={(e, value) => {
                                                            props.setFieldValue("toTruckId", value?.id);
                                                        }}
                                                        renderInput={params => (
                                                            <TextField
                                                                error={Boolean(props.touched.toTruckId && props.errors.toTruckId)}
                                                                helperText={props.touched.toTruckId && props.errors.toTruckId}
                                                                label="Выберите машину"
                                                                name="toTruckId"
                                                                variant="outlined"
                                                                onBlur={props.handleBlur}
                                                                required
                                                                {...params}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                >
                                                    <TextField
                                                        error={Boolean(props.touched.volume && props.errors.volume)}
                                                        fullWidth
                                                        helperText={props.touched.volume && props.errors.volume}
                                                        label="Введите объём (л)"
                                                        name="volume"
                                                        onBlur={props.handleBlur}
                                                        onChange={props.handleChange}
                                                        variant="outlined"
                                                        required
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                >
                                                    <TextField
                                                        error={Boolean(props.touched.description && props.errors.description)}
                                                        fullWidth
                                                        helperText={props.touched.description && props.errors.description}
                                                        label="Напишите коментарии"
                                                        name="description"
                                                        onBlur={props.handleBlur}
                                                        onChange={props.handleChange}
                                                        value={props.values.description}
                                                        variant="outlined"
                                                        multiline
                                                        rows={4}
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
                                                    Создать
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </form>
                            )}
                        </Formik>
                </Box>
                </Container>
            )}
        </Page>
    );
}

export default OutcomeForm;
