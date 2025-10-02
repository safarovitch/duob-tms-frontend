import React from "react";
import {Road, RoadMileageRequest} from "../../model/Road";
import {useSnackbar} from "notistack";
import {Box, Button, Card, CardContent, Grid, makeStyles, TextField} from "@material-ui/core";
import * as Yup from "yup";
import roadService from "../../services/RoadService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {Formik, FormikProps} from "formik";
import {Link as RouterLink, useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2)
    }
}));

const RoadMileage: React.FC<{road: Road, updateRoad: Function}> = ({road, updateRoad}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory()

    if (road.privateTruck) {
        history.go(-1);
        return null;
    }

    const initialValues: RoadMileageRequest = {
        speedometerBefore: road.speedometerBefore,
        speedometerAfter: road.speedometerAfter,
        totalKmDeparture: road.totalKmDeparture,
        totalKmArrival: road.totalKmArrival,
        kmDepartureWithCargo: road.kmDepartureWithCargo,
        kmArrivalWithCargo: road.kmArrivalWithCargo,
        departureCargoWeight: road.departureCargoWeight,
        arrivalCargoWeight: road.arrivalCargoWeight,
        departureTrailerCargoWeight: road.departureTrailerCargoWeight,
        arrivalTrailerCargoWeight: road.arrivalTrailerCargoWeight,
    }

    const validationSchema = Yup.object().shape({
        speedometerBefore: Yup.number().typeError('Значение должно быть числом'),
        speedometerAfter: Yup.number().typeError('Значение должно быть числом'),
        totalKmDeparture: Yup.number().typeError('Значение должно быть числом'),
        totalKmArrival: Yup.number().typeError('Значение должно быть числом'),
        kmDepartureWithCargo: Yup.number().typeError('Значение должно быть числом'),
        kmArrivalWithCargo: Yup.number().typeError('Значение должно быть числом'),
        departureCargoWeight: Yup.number().typeError('Значение должно быть числом'),
        arrivalCargoWeight: Yup.number().typeError('Значение должно быть числом'),
        departureTrailerCargoWeight: Yup.number().typeError('Значение должно быть числом'),
        arrivalTrailerCargoWeight: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleUpdateRoadMileage = async (values: RoadMileageRequest, formActions: { [key: string]: any }) => {
        try {
            values.id = road.id;

            await roadService.updateRoadMileage(values)

            enqueueSnackbar('Рейс обновлен', {variant: 'success'});
            updateRoad()
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
            validationSchema={validationSchema}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)

                await handleUpdateRoadMileage(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<RoadMileageRequest>) => (
                <form
                    onSubmit={props.handleSubmit}
                >
                    <Card className={classes.root}>
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
                                        error={Boolean(props.touched.speedometerBefore && props.errors.speedometerBefore)}
                                        fullWidth
                                        helperText={props.touched.speedometerBefore && props.errors.speedometerBefore}
                                        label="Спидометр до отправки(км)"
                                        name="speedometerBefore"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.speedometerBefore}
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
                                        error={Boolean(props.touched.speedometerAfter && props.errors.speedometerAfter)}
                                        fullWidth
                                        helperText={props.touched.speedometerAfter && props.errors.speedometerAfter}
                                        label="Спидометр после прибытия(км)"
                                        name="speedometerAfter"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.speedometerAfter}
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
                                        error={Boolean(props.touched.totalKmDeparture && props.errors.totalKmDeparture)}
                                        fullWidth
                                        helperText={props.touched.totalKmDeparture && props.errors.totalKmDeparture}
                                        label="Общий километраж отправки(км)"
                                        name="totalKmDeparture"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.totalKmDeparture}
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
                                        error={Boolean(props.touched.totalKmArrival && props.errors.totalKmArrival)}
                                        fullWidth
                                        helperText={props.touched.totalKmArrival && props.errors.totalKmArrival}
                                        label="Общий километраж возврата (км)"
                                        name="totalKmArrival"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.totalKmArrival}
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
                                        error={Boolean(props.touched.kmDepartureWithCargo && props.errors.kmDepartureWithCargo)}
                                        fullWidth
                                        helperText={props.touched.kmDepartureWithCargo && props.errors.kmDepartureWithCargo}
                                        label="Километраж отправки с  грузом (км)"
                                        name="kmDepartureWithCargo"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.kmDepartureWithCargo}
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
                                        error={Boolean(props.touched.kmArrivalWithCargo && props.errors.kmArrivalWithCargo)}
                                        fullWidth
                                        helperText={props.touched.kmArrivalWithCargo && props.errors.kmArrivalWithCargo}
                                        label="Километраж возврата с  грузом (км)"
                                        name="kmArrivalWithCargo"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.kmArrivalWithCargo}
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
                                        error={Boolean(props.touched.departureCargoWeight && props.errors.departureCargoWeight)}
                                        fullWidth
                                        helperText={props.touched.departureCargoWeight && props.errors.departureCargoWeight}
                                        label="Вес груза отправки (кг)"
                                        name="departureCargoWeight"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.departureCargoWeight}
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
                                        error={Boolean(props.touched.arrivalCargoWeight && props.errors.arrivalCargoWeight)}
                                        fullWidth
                                        helperText={props.touched.arrivalCargoWeight && props.errors.arrivalCargoWeight}
                                        label="Вес груза возврата (кг)"
                                        name="arrivalCargoWeight"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.arrivalCargoWeight}
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
                                        error={Boolean(props.touched.departureTrailerCargoWeight && props.errors.departureTrailerCargoWeight)}
                                        fullWidth
                                        helperText={props.touched.departureTrailerCargoWeight && props.errors.departureTrailerCargoWeight}
                                        label="Вес груза отправки прицепа (кг)"
                                        name="departureTrailerCargoWeight"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.departureTrailerCargoWeight}
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
                                        error={Boolean(props.touched.arrivalTrailerCargoWeight && props.errors.arrivalTrailerCargoWeight)}
                                        fullWidth
                                        helperText={props.touched.arrivalTrailerCargoWeight && props.errors.arrivalTrailerCargoWeight}
                                        label="Вес груза возврата прицепа (кг)"
                                        name="arrivalTrailerCargoWeight"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.arrivalTrailerCargoWeight}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Box paddingY={2} />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                >
                                    <TextField
                                        fullWidth
                                        label="ИТОГО по факту (км)"
                                        value={road.totalKmInFact}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                >
                                    <TextField
                                        fullWidth
                                        label="ИТОГО по спидометру (км)"
                                        value={road.totalKmInSpeedometer}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                >
                                    <TextField
                                        fullWidth
                                        label="Разница (км)"
                                        value={road.speedometerDifference}
                                        variant="outlined"
                                        required
                                        disabled
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
                                    to="/app/roads"
                                    component={RouterLink}
                                >
                                    Отмена
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={props.isSubmitting}
                                >
                                    Сохранить
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    )
}

export default RoadMileage
