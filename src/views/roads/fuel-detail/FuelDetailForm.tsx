import React, {useEffect} from "react";
import {RoadFuelDetail, RoadFuelType} from "../../../model/Road";
import {Box, Button, Card, CardContent, Grid, makeStyles, MenuItem, TextField} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteSelectedRoadFuelDetail} from "../../../store/actions/roadActions";
import * as Yup from "yup";
import roadService from "../../../services/RoadService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Formik, FormikProps} from 'formik';

const useStyles = makeStyles((theme) => ({
    root: {},
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2)
    }
}));

const FuelDetailForm: React.FC<{type: RoadFuelType, roadId: string, roadFuelDetail: RoadFuelDetail}> = ({type, roadId, roadFuelDetail}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const dispatch = useDispatch()
    const isOnRoad = type === 'ON_ROAD'

    useEffect(() => () => {
        dispatch(deleteSelectedRoadFuelDetail())
    }, [])

    const initialValues: RoadFuelDetail = {
        refuelingDate: roadFuelDetail?.refuelingDate || '',
        liter: roadFuelDetail?.liter || 0,
        unit: roadFuelDetail?.unit,
        price: roadFuelDetail?.price || 0,
        totalPrice: roadFuelDetail?.totalPrice || 0,
        description: roadFuelDetail?.description || '',
        type: type,
        roadId: Number(roadId)
    }

    const validationSchema = Yup.object().shape({
        liter: Yup.number().typeError('Значение должно быть числом'),
        price: Yup.number().typeError('Значение должно быть числом'),
        totalPrice: Yup.number().typeError('Значение должно быть числом'),
        description: Yup.string().max(255),
    })

    const handleAdd = async (values: RoadFuelDetail, formActions: { [key: string]: any }) => {
        try {
            await roadService.postRoadFuelDetail(values)

            enqueueSnackbar('Создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: RoadFuelDetail, formActions: { [key: string]: any }) => {
        try {
            values.id = roadFuelDetail?.id;

            await roadService.updateRoadFuelDetail(values)

            enqueueSnackbar('Обновлен', {variant: 'success'});
            history.go(-1);
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
            validationSchema={!roadFuelDetail ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                roadFuelDetail ? await handleUpdate(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleAdd(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<RoadFuelDetail>) => (
                <form
                    className={classes.root}
                    onSubmit={props.handleSubmit}
                >
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={Boolean(props.touched.refuelingDate && props.errors.refuelingDate)}
                                        fullWidth
                                        type="date"
                                        helperText={props.touched.refuelingDate && props.errors.refuelingDate}
                                        label="Дата"
                                        InputLabelProps={{shrink: true}}
                                        name="refuelingDate"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.refuelingDate}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                {
                                    isOnRoad && (
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                error={Boolean(props.touched.unit && props.errors.unit)}
                                                fullWidth
                                                helperText={props.touched.unit && props.errors.unit}
                                                label="Выберите валюту"
                                                name="unit"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                value={props.values.unit || ''}
                                                variant="outlined"
                                                required
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
                                                    ['TJS', 'USD'].map((value, index) => (
                                                        <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>
                                    )
                                }
                                <Grid item xs={12} md={isOnRoad ? 4 : 6}>
                                    <TextField
                                        error={Boolean(props.touched.liter && props.errors.liter)}
                                        fullWidth
                                        helperText={props.touched.liter && props.errors.liter}
                                        label="Количество (л)"
                                        placeholder="0"
                                        name="liter"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            props.setFieldValue('totalPrice', props.values.price! * Number(e.target.value))
                                            props.handleChange(e)
                                        }}
                                        value={props.values.liter || ''}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                {
                                    isOnRoad && (
                                        <>
                                            <Grid item xs={12} md={4}>
                                                <TextField
                                                    error={Boolean(props.touched.price && props.errors.price)}
                                                    fullWidth
                                                    helperText={props.touched.price && props.errors.price}
                                                    label="Цена"
                                                    placeholder="0"
                                                    name="price"
                                                    onBlur={props.handleBlur}
                                                    onChange={(e) => {
                                                        props.setFieldValue('totalPrice', props.values.liter * Number(e.target.value))
                                                        props.handleChange(e)
                                                    }}
                                                    value={props.values.price || ''}
                                                    variant="outlined"
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Сумма"
                                                    name="totalPrice"
                                                    value={props.values.totalPrice}
                                                    variant="outlined"
                                                    disabled
                                                />
                                            </Grid>
                                        </>
                                    )
                                }
                                <Grid item xs={12}>
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
                                        rows={2}
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
                                    {roadFuelDetail ? 'Сохранить' : 'Создать'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    )
}

export default FuelDetailForm
