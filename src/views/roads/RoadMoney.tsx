import React from "react";
import {Road, RoadMoneyRequest} from "../../model/Road";
import {useSnackbar} from "notistack";
import {Box, Button, Card, CardContent, Grid, makeStyles, TextField} from "@material-ui/core";
import * as Yup from "yup";
import roadService from "../../services/RoadService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {Formik, FormikProps} from "formik";
import {Link as RouterLink} from "react-router-dom";

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

const RoadMoney: React.FC<{road: Road, updateRoad: Function}> = ({road, updateRoad}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const initialValues: RoadMoneyRequest = {
        contractPriceUsd: road.contractPriceUsd,
        contractPriceTjs: road.contractPriceTjs,
        driverPriceUsd: road.driverPriceUsd,
        driverPriceTjs: road.driverPriceTjs,
        roadCostsUsd: road.roadCostsUsd,
        roadCostsTjs: road.roadCostsTjs,
        roadPriceUsd: road.roadPriceUsd,
        roadPriceTjs: road.roadPriceTjs,
        retentionUsd: road.retentionUsd,
        retentionTjs: road.retentionTjs,
    }

    const validationSchema = Yup.object().shape({
        contractPriceUsd: Yup.number().typeError('Значение должно быть числом'),
        contractPriceTjs: Yup.number().typeError('Значение должно быть числом'),
        driverPriceUsd: Yup.number().typeError('Значение должно быть числом'),
        driverPriceTjs: Yup.number().typeError('Значение должно быть числом'),
        roadCostsUsd: Yup.number().typeError('Значение должно быть числом'),
        roadCostsTjs: Yup.number().typeError('Значение должно быть числом'),
        roadPriceUsd: Yup.number().typeError('Значение должно быть числом'),
        roadPriceTjs: Yup.number().typeError('Значение должно быть числом'),
        retentionUsd: Yup.number().typeError('Значение должно быть числом'),
        retentionTjs: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleUpdateRoadMoney = async (values: RoadMoneyRequest, formActions: { [key: string]: any }) => {
        try {
            values.id = road.id;

            await roadService.updateRoadMoney(values)

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

                await handleUpdateRoadMoney(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<RoadMoneyRequest>) => (
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
                                        error={Boolean(props.touched.contractPriceTjs && props.errors.contractPriceTjs)}
                                        fullWidth
                                        helperText={props.touched.contractPriceTjs && props.errors.contractPriceTjs}
                                        label="Укажите сумму договора (сомони)"
                                        name="contractPriceTjs"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.contractPriceTjs}
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
                                        error={Boolean(props.touched.contractPriceUsd && props.errors.contractPriceUsd)}
                                        fullWidth
                                        helperText={props.touched.contractPriceUsd && props.errors.contractPriceUsd}
                                        label="Укажите сумму договора ($)"
                                        name="contractPriceUsd"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.contractPriceUsd}
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
                                        error={Boolean(props.touched.driverPriceTjs && props.errors.driverPriceTjs)}
                                        fullWidth
                                        helperText={props.touched.driverPriceTjs && props.errors.driverPriceTjs}
                                        label="Введите услугу водителя (сомони)"
                                        name="driverPriceTjs"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.driverPriceTjs}
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
                                        error={Boolean(props.touched.driverPriceUsd && props.errors.driverPriceUsd)}
                                        fullWidth
                                        helperText={props.touched.driverPriceUsd && props.errors.driverPriceUsd}
                                        label="Введите услугу водителя ($)"
                                        name="driverPriceUsd"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.driverPriceUsd}
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
                                        error={Boolean(props.touched.roadCostsTjs && props.errors.roadCostsTjs)}
                                        fullWidth
                                        helperText={props.touched.roadCostsTjs && props.errors.roadCostsTjs}
                                        label="Введите расходы в пути (сомони)"
                                        name="roadCostsTjs"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.roadCostsTjs}
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
                                        error={Boolean(props.touched.roadCostsUsd && props.errors.roadCostsUsd)}
                                        fullWidth
                                        helperText={props.touched.roadCostsUsd && props.errors.roadCostsUsd}
                                        label="Введите расходы в пути ($)"
                                        name="roadCostsUsd"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.roadCostsUsd}
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
                                        error={Boolean(props.touched.roadPriceTjs && props.errors.roadPriceTjs)}
                                        fullWidth
                                        helperText={props.touched.roadPriceTjs && props.errors.roadPriceTjs}
                                        label="Введите стоимость рейса (сомони)"
                                        name="roadPriceTjs"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.roadPriceTjs}
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
                                        error={Boolean(props.touched.roadPriceUsd && props.errors.roadPriceUsd)}
                                        fullWidth
                                        helperText={props.touched.roadPriceUsd && props.errors.roadPriceUsd}
                                        label="Введите стоимость рейса ($)"
                                        name="roadPriceUsd"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.roadPriceUsd}
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
                                        fullWidth
                                        label="Заправка в пути (сомони)"
                                        value={road.refuelingOnRoadPriceTjs}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        fullWidth
                                        label="Заправка в пути ($)"
                                        value={road.refuelingOnRoadPriceUsd}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.retentionTjs && props.errors.retentionTjs)}
                                        fullWidth
                                        helperText={props.touched.retentionTjs && props.errors.retentionTjs}
                                        label="Введите стоимость удержание рейса (сомони)"
                                        name="retentionTjs"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.retentionTjs}
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
                                        error={Boolean(props.touched.retentionUsd && props.errors.retentionUsd)}
                                        fullWidth
                                        helperText={props.touched.retentionUsd && props.errors.retentionUsd}
                                        label="Введите стоимость удержание рейса ($)"
                                        name="retentionUsd"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.retentionUsd}
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
                                        fullWidth
                                        label="ИТОГО (сомони)"
                                        value={road.totalContractPriceTjs}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        fullWidth
                                        label="ИТОГО ($)"
                                        value={road.totalContractPriceUsd}
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

export default RoadMoney
