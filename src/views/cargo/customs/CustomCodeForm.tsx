import React, {useEffect, useState} from 'react';
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
    Select,
    TextField
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {CargoCustomCode, CargoProduct, CustomCodeFormProps, Units} from "../../../model/Cargo";
import cargoService from "../../../services/CargoService";
import {deleteSelectedCustomCode} from "../../../store/actions/cargoActions";

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


const CustomCodeForm: React.FC<CustomCodeFormProps> = (props: CustomCodeFormProps) => {
    const {className, customCode} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();
    const [products, setProducts] = useState<CargoProduct[]>([])




    useEffect(() => () => {
        dispatch(deleteSelectedCustomCode())
    }, [])

    useEffect(() => {
        getAllProducts()
    }, [])

    const initialValues: CargoCustomCode = {
        // name: customCode?.productDto.name || '',
        code: customCode?.code || '',
        price: customCode?.price || null,
        baseRate: customCode?.baseRate || null,
        vat: customCode?.vat || null,
        totalRate: customCode?.totalRate || null,
        description: customCode?.description || '',
        unit: customCode?.unit as Units || Units.ton,
        productId: customCode?.productId || 2

    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255)
    })

    const getAllProducts = async () => {
        try {
            const resProducts: any = await cargoService.getAllProducts();
            setProducts(resProducts)

        } catch (error) {

            enqueueSnackbar(`Произошла ошибка. Не получилось получить список всех Наименований. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getAllProducts()}>Рестарт</Button>
            });
        }
    }

    const handleAddCustomCode = async (values: CargoCustomCode, formActions: { [key: string]: any }) => {
        try {
            formActions.setStatus({success: true});
            formActions.setSubmitting(false);
            await cargoService.postCustomCode(values)
            enqueueSnackbar('Томоженный код создан', {
                variant: 'success',
                action: <Button>ОК</Button>
            });
            // history.go(-1);
            // formActions.resetForm();
        } catch (error) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button>OK</Button>
            });
        }
    }

    const handleUpdateCustomCode = async (values: CargoCustomCode, formActions: { [key: string]: any }) => {
        try {
            formActions.setStatus({success: true});
            formActions.setSubmitting(false);
            values.id = customCode?.id;
            await cargoService.updateCustomCode(values)
            enqueueSnackbar('Томоженный код обновлено', {
                variant: 'success',
                action: <Button>ОК</Button>
            });
            // history.go(-1);
        } catch (error) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button>OK</Button>
            });
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
                                    <Select
                                        error={Boolean(props.touched.code && props.errors.code)}
                                        fullWidth
                                        onBlur={props.handleBlur}
                                        required
                                        variant="outlined"
                                        label="Наименование груза"
                                        name="productId"
                                        value={props.values.productId}
                                        onChange={props.handleChange}
                                    >
                                        {products.map((product) => (
                                            <MenuItem value={product.id}>
                                                {product.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
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

                                    {/*<TextField*/}
                                    {/*    error={Boolean(props.touched.description && props.errors.description)}*/}
                                    {/*    fullWidth*/}
                                    {/*    helperText={props.touched.description && props.errors.description}*/}
                                    {/*    label="Код"*/}
                                    {/*    name="description"*/}
                                    {/*    onBlur={props.handleBlur}*/}
                                    {/*    onChange={props.handleChange}*/}
                                    {/*    required*/}
                                    {/*    value={props.values.description}*/}
                                    {/*    variant="outlined"*/}
                                    {/*/>*/}
                                    {/*<Checkbox*/}
                                    {/*    checked={true}*/}
                                    {/*    name="checkedB"*/}
                                    {/*    color="primary"*/}
                                    {/*/>*/}
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
