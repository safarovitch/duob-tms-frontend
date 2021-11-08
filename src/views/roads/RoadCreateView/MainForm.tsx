import React, {useState} from "react";
import {Formik, FormikProps} from "formik";
import {Road, RoadRequest, RoadTruck} from "../../../model/Road";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    makeStyles,
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

const MainForm: React.FC<{road?: Road, updateRoad?: Function, trucks: RoadTruck[]}> = ({road, updateRoad, trucks}) => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [trailerNumber, setTrailerNumber] = useState(road?.trailer?.number || '')
    const [driverName, setDriverName] = useState(road?.driver?.name || '')
    const [privateTruck, setPrivateTruck] = useState<boolean>(road?.privateTruck || false)
    const [hasTrailer, setHasTrailer] = useState<boolean>(false)

    const initialValues: RoadRequest = {
        road: road?.road || '',
        truck: road?.truck,
        truckId: road?.truck?.id || 0,
        departureDate: road?.departureDate || '',
        arrivalDate: road?.arrivalDate || '',
        description: road?.description || '',
        privateTruck: road?.privateTruck || false,
        withTrailer: road?.withTrailer || false,
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
            updateRoad && updateRoad()
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
                                        options={trucks}
                                        getOptionLabel={option => option.number}
                                        getOptionSelected={(option, value) => option.number === value.number}
                                        onChange={(e, value) => {
                                            props.setFieldValue("truckId", value?.id)
                                            props.setFieldValue("truck", value)
                                            setTrailerNumber(value?.trailerNumber || '')
                                            setDriverName(value?.driverName || '')
                                            setHasTrailer(Boolean(value?.trailerNumber))
                                            !Boolean(value?.trailerNumber) && props.setFieldValue("withTrailer", false)
                                        }}
                                        disabled={road ? true : privateTruck}
                                        value={road ? props.values.truck as RoadTruck : undefined}
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
                                        fullWidth
                                        label="Водитель"
                                        value={driverName}
                                        variant="outlined"
                                        disabled
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
                                                disabled={!!road || (privateTruck || !hasTrailer)}
                                            />
                                        }
                                        label="C прицепом"
                                    />
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
