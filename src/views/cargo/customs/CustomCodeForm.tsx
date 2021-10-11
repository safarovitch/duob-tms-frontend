import React, {useEffect} from 'react';
import * as Yup from 'yup';
import {Formik, FormikProps} from 'formik';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Grid,
    makeStyles,
    MenuItem,
    TextField, Typography
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {CargoCustomCode, CustomCodeFormProps, Units} from "../../../model/Cargo";
import cargoService from "../../../services/CargoService";
import {deleteSelectedCustomCode} from "../../../store/actions/cargoActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const useStyles = makeStyles((theme) => ({
    root: {},
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2)
    },
    checkbox: {
        display: 'flex'
    },
    checkboxLabel: {
        marginTop: 8
    }
}));


const CustomCodeForm: React.FC<CustomCodeFormProps> = ({customCode, products}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedCustomCode())
    }, [])

    const initialValues: CargoCustomCode = {
        code: customCode?.code || '',
        price: customCode?.price || undefined,
        baseRate: customCode?.baseRate || undefined,
        vat: customCode?.vat || undefined,
        totalRate: customCode?.totalRate || undefined,
        description: customCode?.description || '',
        unit: customCode?.unit as Units || Units.ton,
        productId: customCode?.productDto?.id || undefined,
        isUnitThing: customCode ? customCode?.unit === Units.thing : false

    }

    const validationSchema = Yup.object().shape({
        code: Yup.string().max(255),
        price: Yup.string().max(255),
        baseRate: Yup.string().max(255),
        vat: Yup.string().max(255),
        totalRate: Yup.string().max(255),
    })

    const handleAddCustomCode = async (values: CargoCustomCode, formActions: { [key: string]: any }) => {
        try {
            await cargoService.postCustomCode(values)

            enqueueSnackbar('Томоженный код создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateCustomCode = async (values: CargoCustomCode, formActions: { [key: string]: any }) => {
        try {
            values.id = customCode?.id;

            await cargoService.updateCustomCode(values)

            enqueueSnackbar('Томоженный код обновлено', {variant: 'success'});
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
            validationSchema={!customCode ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                customCode ? await handleUpdateCustomCode(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleAddCustomCode(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<CargoCustomCode>) => (
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
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.productId && props.errors.productId)}
                                        fullWidth
                                        helperText={props.touched.productId && props.errors.productId}
                                        label="Наименование груза"
                                        name="productId"
                                        select
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.productId}
                                        variant="outlined"
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
                                        {products.map((product) => (
                                            <MenuItem value={product.id} key={product.id}>
                                                {product.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.code && props.errors.code)}
                                        fullWidth
                                        helperText={props.touched.code && props.errors.code}
                                        label="Код"
                                        name="code"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.code}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.price && props.errors.price)}
                                        fullWidth
                                        helperText={props.touched.price && props.errors.price}
                                        label="Цена"
                                        name="price"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.price}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.vat && props.errors.vat)}
                                        fullWidth
                                        helperText={props.touched.vat && props.errors.vat}
                                        label="НДС %"
                                        name="vat"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.vat}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.baseRate && props.errors.baseRate)}
                                        fullWidth
                                        helperText={props.touched.baseRate && props.errors.baseRate}
                                        label="Базовая ставка %"
                                        name="baseRate"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.baseRate}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.totalRate && props.errors.totalRate)}
                                        fullWidth
                                        helperText={props.touched.totalRate && props.errors.totalRate}
                                        label="Итоговая ставка %"
                                        name="totalRate"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.totalRate}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.description && props.errors.description)}
                                        fullWidth
                                        multiline
                                        helperText={props.touched.description && props.errors.description}
                                        label="Описание"
                                        name="description"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.description}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                >
                                    <label onClick={props.handleChange} className={classes.checkbox}>
                                        <Checkbox
                                            checked={props.values.isUnitThing}
                                            name="isUnitThing"
                                            color="primary"
                                            onChange={props.handleChange}
                                        />
                                        <Typography variant="subtitle1" className={classes.checkboxLabel}>
                                            Вести расчет по штукам - (шт)
                                        </Typography>
                                    </label>
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
                                    {customCode ? 'Сохранить' : 'Добавить'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default CustomCodeForm;
