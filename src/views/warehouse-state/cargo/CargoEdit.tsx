import React, {useEffect, useState} from "react";
import {NavLink as RouterLink, useHistory} from "react-router-dom";
import {useParams} from "react-router";
import {
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Link,
    makeStyles, MenuItem, TextField,
    Typography
} from "@material-ui/core";
import {WarehouseStateCargoRequest} from "../../../model/Warehouse";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Page from "../../../components/Page";
import {useSnackbar} from "notistack";
import warehouseService from "../../../services/WarehouseService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Customer} from "../../../model/Customer";
import customerService from "../../../services/CustomerService";
import {Provider} from "../../../model/Provider";
import providerService from "../../../services/ProviderService";
import {CargoCustomCode, CargoProduct, CargoTariff, CargoType} from "../../../model/Cargo";
import cargoService from "../../../services/CargoService";
import LoadingLayout from "../../../components/LoadingLayout";
import * as Yup from "yup";
import {Formik, FormikProps} from 'formik';
import {Autocomplete} from "@material-ui/lab";
import {mapOfTypeCalculationCargoEnum, TypeCalculationCargoEnum} from "../../../constants";

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

const CargoEdit: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {id: cargoId} = useParams<{ id: string }>()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [cargo, setCargo] = useState<WarehouseStateCargoRequest>()
    const [customers, setCustomers] = useState<Customer[]>([])
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [providers, setProviders] = useState<Provider[]>([])
    const [provider, setProvider] = useState<Provider | null>(null)
    const [cargoTypes, setCargoTypes] = useState<CargoType[]>([])
    const [cargoType, setCargoType] = useState<CargoType | null>(null)
    const [cargoTariffs, setCargoTariffs] = useState<CargoTariff[]>([])
    const [cargoTariff, setCargoTariff] = useState<CargoTariff | null>(null)
    const [cargoProducts, setCargoProducts] = useState<CargoProduct[]>([])
    const [cargoProduct, setCargoProduct] = useState<CargoProduct | null>(null)
    const [cargoCustomCodes, setCargoCustomCodes] = useState<CargoCustomCode[]>([])
    const [cargoCustomCode, setCargoCustomCode] = useState<CargoCustomCode | null>(null)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const dataCargo: any = await warehouseService.getCargo(Number(cargoId))
                const dataCustomers: any = await customerService.getFilteredCustomers(1, 10000, '')
                const dataProviders: any = await providerService.getFilteredProvider(1, 10000, '')
                const dataCargoTypes: any = await cargoService.getFilteredCargoTypes(1, 10000, '')
                const dataCargoTariffs: any = await cargoService.getFilteredCargoTariffs(1, 10000, '')
                const dataCargoProducts: any = await cargoService.getAllProducts()
                const dataCargoCustomCodes: any = await cargoService.getFilteredCustomCodes(1, 10000, '')

                if (!cancel) {
                    setCargo(dataCargo)
                    setCustomers(dataCustomers.content)
                    setCustomer(dataCustomers.content.find((item: Customer) => item.id === dataCargo.clientId))
                    setProviders(dataProviders.content)
                    setProvider(dataProviders.content.find((item: Provider) => item.id === dataCargo.providerId))
                    setCargoTypes(dataCargoTypes.content)
                    setCargoType(dataCargoTypes.content.find((item: CargoType) => item.id === dataCargo.cargoTypeId))
                    setCargoTariffs(dataCargoTariffs.content)
                    setCargoTariff(dataCargoTariffs.content.find((item: CargoType) => item.id === dataCargo.tariffId))
                    setCargoProducts(dataCargoProducts)
                    setCargoProduct(dataCargoProducts.find((item: CargoType) => item.id === dataCargo.productId))
                    setCargoCustomCodes(dataCargoCustomCodes.content)
                    setCargoCustomCode(dataCargoCustomCodes.content.find((item: CargoCustomCode) => item.id === dataCargo.customCodeId))
                }
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, cargoId]);

    const initialValues: WarehouseStateCargoRequest = {
        id: cargo?.id,
        clientId: cargo?.clientId || 0,
        providerId: cargo?.providerId || 0,
        cargoTypeId: cargo?.cargoTypeId || 0,
        tariffId: cargo?.tariffId || 0,
        productId: cargo?.productId || 0,
        customCodeId: cargo?.customCodeId || 0,
        weightCargo: cargo?.weightCargo || 0,
        lengthCargo: cargo?.lengthCargo || 0,
        widthCargo: cargo?.widthCargo || 0,
        heightCargo: cargo?.heightCargo || 0,
        typeCalculation: cargo?.typeCalculation as TypeCalculationCargoEnum || TypeCalculationCargoEnum.calculationRateWeight
    }

    const validationSchema = Yup.object().shape({
        weightCargo: Yup.number().typeError('Значение должно быть числом'),
        lengthCargo: Yup.number().typeError('Значение должно быть числом'),
        widthCargo: Yup.number().typeError('Значение должно быть числом'),
        heightCargo: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleUpdateProduct = async (values: WarehouseStateCargoRequest, formActions: { [key: string]: any }) => {
        try {
            values.id = Number(cargo?.id);
            let updateCargo = {...cargo, ...values}

            delete updateCargo.createdDate
            delete updateCargo.updatedDate

            await warehouseService.updateCargo(updateCargo)

            enqueueSnackbar('Груз обновлено', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Page title="Изменение груза">
            {
                customers.length > 0 && providers.length > 0 && cargoTypes.length > 0 && cargoTariffs.length > 0
                                                        && cargoProducts.length > 0 && cargoCustomCodes.length > 0 ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Breadcrumbs
                            separator={<NavigateNextIcon fontSize="small"/>}
                            aria-label="breadcrumb"
                        >
                            <Link
                                variant="body1"
                                color="inherit"
                                to="/app"
                                component={RouterLink}
                            >
                                Главная
                            </Link>
                            <Link
                                variant="body1"
                                color="inherit"
                                to="/app/warehouse-state"
                                component={RouterLink}
                            >
                                Состояние складов
                            </Link>
                            <Link
                                variant="body1"
                                color="inherit"
                                to={`/app/warehouse-state/${cargoId}`}
                                component={RouterLink}
                            >
                                Груз {cargoId}
                            </Link>
                            <Typography variant="body1" color="textPrimary">
                                Изменение груза
                            </Typography>
                        </Breadcrumbs>
                        <Typography variant="h3" color="textPrimary">
                            Изменение груза
                        </Typography>
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
                                    await handleUpdateProduct(values, {
                                        resetForm,
                                        setErrors,
                                        setStatus,
                                        setSubmitting
                                    })
                                }}
                            >
                                {(props: FormikProps<WarehouseStateCargoRequest>) => (
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
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <Autocomplete
                                                            options={customers}
                                                            getOptionLabel={option => option.code}
                                                            getOptionSelected={(option, value) => option.code === value.code}
                                                            value={customer}
                                                            onChange={(e, value) => {
                                                                props.setFieldValue("clientId", value?.id);
                                                                setCustomer(value)
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    error={Boolean(props.touched.clientId && props.errors.clientId)}
                                                                    helperText={props.touched.clientId && props.errors.clientId}
                                                                    label="Выберите код клиента"
                                                                    name="clientId"
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
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <Autocomplete
                                                            options={providers}
                                                            getOptionLabel={option => option.code}
                                                            getOptionSelected={(option, value) => option.code === value.code}
                                                            value={provider}
                                                            onChange={(e, value) => {
                                                                props.setFieldValue("providerId", value?.id);
                                                                setProvider(value)
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    error={Boolean(props.touched.providerId && props.errors.providerId)}
                                                                    helperText={props.touched.providerId && props.errors.providerId}
                                                                    label="Выберите поставщика"
                                                                    name="providerId"
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
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <Autocomplete
                                                            options={cargoTypes}
                                                            getOptionLabel={option => option.name}
                                                            getOptionSelected={(option, value) => option.name === value.name}
                                                            value={cargoType}
                                                            onChange={(e, value) => {
                                                                props.setFieldValue("cargoTypeId", value?.id);
                                                                setCargoType(value)
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    error={Boolean(props.touched.cargoTypeId && props.errors.cargoTypeId)}
                                                                    helperText={props.touched.cargoTypeId && props.errors.cargoTypeId}
                                                                    label="Выберите вид груза"
                                                                    name="cargoTypeId"
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
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <Autocomplete
                                                            options={cargoTariffs}
                                                            getOptionLabel={option => option.name}
                                                            getOptionSelected={(option, value) => option.name === value.name}
                                                            value={cargoTariff}
                                                            onChange={(e, value) => {
                                                                props.setFieldValue("tariffId", value?.id);
                                                                setCargoTariff(value)
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    error={Boolean(props.touched.tariffId && props.errors.tariffId)}
                                                                    helperText={props.touched.tariffId && props.errors.tariffId}
                                                                    label="Выберите тариф"
                                                                    name="tariffId"
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
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <Autocomplete
                                                            options={cargoProducts}
                                                            getOptionLabel={option => option.name}
                                                            getOptionSelected={(option, value) => option.name === value.name}
                                                            value={cargoProduct}
                                                            onChange={(e, value) => {
                                                                props.setFieldValue("productId", value?.id);
                                                                setCargoProduct(value)
                                                                setCargoCustomCode(null)
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    error={Boolean(props.touched.productId && props.errors.productId)}
                                                                    helperText={props.touched.productId && props.errors.productId}
                                                                    label="Выберите наименование"
                                                                    name="productId"
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
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <Autocomplete
                                                            options={cargoCustomCodes.filter((item: CargoCustomCode) => item?.productDto?.id === props.values.productId)}
                                                            getOptionLabel={option => option.code!}
                                                            getOptionSelected={(option, value) => option.code === value.code}
                                                            value={cargoCustomCode}
                                                            onChange={(e, value) => {
                                                                props.setFieldValue("customCodeId", value?.id);
                                                                setCargoCustomCode(value)
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    error={Boolean(props.touched.customCodeId && props.errors.customCodeId)}
                                                                    helperText={props.touched.customCodeId && props.errors.customCodeId}
                                                                    label="Выберите таможенный код"
                                                                    name="customCodeId"
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
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <TextField
                                                            error={Boolean(props.touched.weightCargo && props.errors.weightCargo)}
                                                            fullWidth
                                                            helperText={props.touched.weightCargo && props.errors.weightCargo}
                                                            label="Введите вес (кг)"
                                                            placeholder="0"
                                                            name="weightCargo"
                                                            onBlur={props.handleBlur}
                                                            onChange={props.handleChange}
                                                            value={props.values.weightCargo}
                                                            variant="outlined"
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <TextField
                                                            error={Boolean(props.touched.lengthCargo && props.errors.lengthCargo)}
                                                            fullWidth
                                                            helperText={props.touched.lengthCargo && props.errors.lengthCargo}
                                                            label="Введите длину (м)"
                                                            placeholder="0"
                                                            name="lengthCargo"
                                                            onBlur={props.handleBlur}
                                                            onChange={props.handleChange}
                                                            value={props.values.lengthCargo}
                                                            variant="outlined"
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <TextField
                                                            error={Boolean(props.touched.widthCargo && props.errors.widthCargo)}
                                                            fullWidth
                                                            helperText={props.touched.widthCargo && props.errors.widthCargo}
                                                            label="Введите ширину (м)"
                                                            placeholder="0"
                                                            name="widthCargo"
                                                            onBlur={props.handleBlur}
                                                            onChange={props.handleChange}
                                                            value={props.values.widthCargo}
                                                            variant="outlined"
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <TextField
                                                            error={Boolean(props.touched.heightCargo && props.errors.heightCargo)}
                                                            fullWidth
                                                            helperText={props.touched.heightCargo && props.errors.heightCargo}
                                                            label="Введите высоту (м)"
                                                            placeholder="0"
                                                            name="heightCargo"
                                                            onBlur={props.handleBlur}
                                                            onChange={props.handleChange}
                                                            value={props.values.heightCargo}
                                                            variant="outlined"
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={4}
                                                        xs={12}
                                                    >
                                                        <TextField
                                                            select
                                                            error={Boolean(props.touched.typeCalculation && props.errors.typeCalculation)}
                                                            fullWidth
                                                            helperText={props.touched.typeCalculation && props.errors.typeCalculation}
                                                            label="Склад"
                                                            name="typeCalculation"
                                                            onBlur={props.handleBlur}
                                                            onChange={props.handleChange}
                                                            value={props.values.typeCalculation}
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
                                                            {Object.keys(TypeCalculationCargoEnum).map((item, index) => (
                                                                <MenuItem key={index} value={item}>{mapOfTypeCalculationCargoEnum.get(item as TypeCalculationCargoEnum)}</MenuItem>
                                                            ))}
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
                                                        Сохранить
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    )
}

export default CargoEdit
