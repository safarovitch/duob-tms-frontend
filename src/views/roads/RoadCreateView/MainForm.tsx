import React, {useState} from "react";
import {Formik, FormikProps} from "formik";
import {Driver, Road, RoadRequest, Truck} from "../../../model/Road";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    makeStyles,
    MenuItem,
    TextField
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import * as Yup from "yup";
import roadService from "../../../services/RoadService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
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
    },
}));

const getTrailerNumber = (trucks: Truck[], truckId: number) => {
    const truck = trucks.find(truck => truck.id === truckId)
    return truck?.trailerNumber || ''
}

const MainForm: React.FC<{road?: Road, updateRoad?: Function, trucks: Truck[], drivers: Driver[]}> = ({road, updateRoad, trucks, drivers}) => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [trailerNumber, setTrailerNumber] = useState<string>(getTrailerNumber(trucks, road?.truck?.id || 0))
    const [privateTruck, setPrivateTruck] = useState<boolean>(road?.privateTruck || false)

    const initialValues: RoadRequest = {
        road: road?.road || '',
        truck: road?.truck,
        truckId: road?.truck?.id || 0,
        departureDate: road?.departureDate || '',
        arrivalDate: road?.arrivalDate || '',
        driverId: road?.driver?.id || 0,
        driver: road?.driver,
        description: road?.description || '',
        privateTruck: road?.privateTruck || false,
        withTrailer: road?.withTrailer || false,
        status: road?.status === undefined ? 1 : +road.status,
    }

    const validationSchema = Yup.object().shape({
        road: Yup.string().max(255),
        description: Yup.string().max(255),
    })

    const handleAddRoad = async (values: RoadRequest, formActions: { [key: string]: any }) => {
        try {
            await roadService.postRoad(values)

            enqueueSnackbar('Рейс создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateRoad = async (values: RoadRequest, formActions: { [key: string]: any }) => {
        try {
            values.id = road?.id;

            await roadService.updateRoad(values)

            enqueueSnackbar('Рейс обновлен', {variant: 'success'})
            updateRoad && updateRoad().then(null)
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

                road
                    ? await handleUpdateRoad(values, {
                        resetForm,
                        setErrors,
                        setStatus,
                        setSubmitting
                    })
                    : await handleAddRoad(values, {
                        resetForm,
                        setErrors,
                        setStatus,
                        setSubmitting
                    })
            }}
        >
            {(props: FormikProps<RoadRequest>) => (
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
                                    md={4}
                                >
                                    <TextField
                                        error={Boolean(props.touched.road && props.errors.road)}
                                        fullWidth
                                        helperText={props.touched.road && props.errors.road}
                                        label="Путь рейса"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Введите путь рейса"
                                        name="road"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.road}
                                        variant="outlined"
                                        required
                                        autoFocus
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <Autocomplete
                                        options={trucks}
                                        getOptionLabel={option => option.number}
                                        getOptionSelected={(option, value) => option.number === value.number}
                                        onChange={(e, value) => {
                                            setTrailerNumber(value?.trailerNumber || '')
                                            props.setFieldValue("truckId", value?.id || 0);
                                            props.setFieldValue("truck", value);
                                        }}
                                        disabled={road ? true : privateTruck}
                                        value={road ? props.values.truck as Truck : undefined}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.truckId && props.errors.truckId)}
                                                helperText={props.touched.truckId && props.errors.truckId}
                                                label="Выберите машину"
                                                name="truckId"
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
                                    md={4}
                                >
                                    <TextField
                                        fullWidth
                                        label="Прицеп"
                                        value={trailerNumber}
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <TextField
                                        error={Boolean(props.touched.departureDate && props.errors.departureDate)}
                                        fullWidth
                                        type="date"
                                        helperText={props.touched.departureDate && props.errors.departureDate}
                                        label="Дата отправки"
                                        InputLabelProps={{shrink: true}}
                                        name="departureDate"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.departureDate}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <TextField
                                        error={Boolean(props.touched.arrivalDate && props.errors.arrivalDate)}
                                        fullWidth
                                        type="date"
                                        helperText={props.touched.arrivalDate && props.errors.arrivalDate}
                                        label="Дата возврата"
                                        InputLabelProps={{shrink: true}}
                                        name="arrivalDate"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.arrivalDate}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <Autocomplete
                                        options={drivers}
                                        getOptionLabel={option => option.name}
                                        getOptionSelected={(option, value) => option.name === value.name}
                                        onChange={(e, value) => {
                                            props.setFieldValue("driverId", value?.id || 0);
                                            props.setFieldValue("driver", value);
                                        }}
                                        value={road ? props.values.driver as Driver : undefined}
                                        disabled={road ? true : privateTruck}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.driverId && props.errors.driverId)}
                                                helperText={props.touched.driverId && props.errors.driverId}
                                                label="Выберите водителя"
                                                name="driverId"
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
                                        error={Boolean(props.touched.description && props.errors.description)}
                                        fullWidth
                                        helperText={props.touched.description && props.errors.description}
                                        label="Примечание"
                                        InputLabelProps={{shrink: true}}
                                        placeholder="Напишите коментарии"
                                        name="description"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.description}
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="privateTruck"
                                                color="primary"
                                                onBlur={props.handleBlur}
                                                onChange={(e) => {
                                                    setPrivateTruck(e.target.checked)
                                                    props.handleChange(e)
                                                }}
                                                checked={props.values.privateTruck}
                                                disabled={!!road}
                                            />
                                        }
                                        label="Частная"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="withTrailer"
                                                color="primary"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                checked={props.values.withTrailer}
                                                disabled={road ? true : privateTruck}
                                            />
                                        }
                                        label="C прицепом"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <TextField
                                        select
                                        error={Boolean(props.touched.status && props.errors.status)}
                                        fullWidth
                                        helperText={props.touched.status && props.errors.status}
                                        label="Статус"
                                        name="status"
                                        value={props.values.status}
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        variant="outlined"
                                        required
                                        disabled={!road}
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
                                        <MenuItem key={0} value={1}>Активный</MenuItem>
                                        <MenuItem key={1} value={0}>Завершенный</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Box mt={2} pb={1} className={classes.buttons}>
                                <Button
                                    className={classes.cancelButton}
                                    variant="outlined"
                                    color="secondary"
                                    type="button"
                                    to="/app/roads"
                                    component={RouterLink}
                                    disabled={props.isSubmitting}
                                >
                                    Отмена
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={props.isSubmitting}
                                >
                                    {road ? 'Сохранить' : 'Создать'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    )
}

export default MainForm
