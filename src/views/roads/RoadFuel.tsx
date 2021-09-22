import React from "react";
import {Road, RoadFuelRequest} from "../../model/Road";
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

const RoadFuel: React.FC<{road: Road, updateRoad: Function}> = ({road, updateRoad}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory()

    if (road.privateTruck) {
        history.go(-1);
        return null;
    }

    const initialValues: RoadFuelRequest = {
        refuelingOnBase: road.refuelingOnBase,
        refuelingOnWay: road.refuelingOnWay,
        additionalFuelOutcome: road.additionalFuelOutcome,
    }

    const validationSchema = Yup.object().shape({
        refuelingOnBase: Yup.number().typeError('Значение должно быть числом'),
        refuelingOnWay: Yup.number().typeError('Значение должно быть числом'),
        additionalFuelOutcome: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleUpdateRoadFuel = async (values: RoadFuelRequest, formActions: { [key: string]: any }) => {
        try {
            values.id = road.id;

            await roadService.updateRoadFuel(values)

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

                await handleUpdateRoadFuel(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<RoadFuelRequest>) => (
                <form
                    onSubmit={props.handleSubmit}
                >
                    <Card className={classes.root}>
                        <CardContent>
                            <Grid
                                container
                                spacing={4}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Остаток в баке до отправки(л)"
                                        value={road.fuelBalanceBeforeDeparture}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        error={Boolean(props.touched.refuelingOnBase && props.errors.refuelingOnBase)}
                                        fullWidth
                                        helperText={props.touched.refuelingOnBase && props.errors.refuelingOnBase}
                                        label="Заправка на базе (л)"
                                        name="refuelingOnBase"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.refuelingOnBase}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        error={Boolean(props.touched.refuelingOnWay && props.errors.refuelingOnWay)}
                                        fullWidth
                                        helperText={props.touched.refuelingOnWay && props.errors.refuelingOnWay}
                                        label="Заправка в пути (л)"
                                        name="refuelingOnWay"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.refuelingOnWay}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Общая заправка (л)"
                                        value={road.totalRefueling}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Расход отправки без груза"
                                        value={road.fuelOutcomeDepartureWithoutCargo}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Расход отправки с грузом"
                                        value={road.fuelOutcomeDepartureWithCargo}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Расход отправки прицепа (кг)"
                                        value={road.fuelOutcomeDepartureWithTrailer}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Общий расход отправки"
                                        value={road.totalFuelOutcomeDeparture}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Расход возврата с без груза"
                                        value={road.fuelOutcomeArrivalWithoutCargo}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Расход возврата с грузом"
                                        value={road.fuelOutcomeArrivalWithCargo}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Расход прицепа с грузом"
                                        value={road.fuelOutcomeArrivalWithCargoAndTrailer}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Общий расход возврата"
                                        value={road.totalFuelOutcomeArrival}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Общий расход"
                                        value={road.totalFuelOutcome}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        error={Boolean(props.touched.additionalFuelOutcome && props.errors.additionalFuelOutcome)}
                                        fullWidth
                                        helperText={props.touched.additionalFuelOutcome && props.errors.additionalFuelOutcome}
                                        label="Дополнительный  расход (л)"
                                        name="additionalFuelOutcome"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.additionalFuelOutcome}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="Остаток в баке после прибытье"
                                        value={road.tankBalanceAfterArrival}
                                        variant="outlined"
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

export default RoadFuel
