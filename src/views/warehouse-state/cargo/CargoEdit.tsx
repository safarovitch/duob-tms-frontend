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
    makeStyles,
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
    const [providers, setProviders] = useState<Provider[]>([])
    const [cargoTypes, setCargoTypes] = useState<CargoType[]>([])
    const [cargoTariffs, setCargoTariffs] = useState<CargoTariff[]>([])
    const [cargoProducts, setCargoProducts] = useState<CargoProduct[]>([])
    const [cargoCustomCodes, setCargoCustomCodes] = useState<CargoCustomCode[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const dataCargo: any = await warehouseService.getWarehouseStateCargo(Number(cargoId))
                const dataCustomers: any = await customerService.getFilteredCustomers(1, 10000, '')
                const dataProviders: any = await providerService.getFilteredProvider(1, 10000, '')
                const dataCargoTypes: any = await cargoService.getFilteredCargoTypes(1, 10000, '')
                const dataCargoTariffs: any = await cargoService.getFilteredCargoTariffs(1, 10000, '')
                const dataCargoProducts: any = await cargoService.getAllProducts()
                const dataCargoCustomCodes: any = await cargoService.getFilteredCustomCodes(1, 10000, '')

                if (!cancel) {
                    setCargo(dataCargo[0])
                    setCustomers(dataCustomers.content)
                    setProviders(dataProviders.content)
                    setCargoTypes(dataCargoTypes.content)
                    setCargoTariffs(dataCargoTariffs.content)
                    setCargoProducts(dataCargoProducts)
                    setCargoCustomCodes(dataCargoCustomCodes.content)
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
        clientCode: cargo?.clientCode || '',
        providerCode: cargo?.providerCode || '',
        cargoTypeName: cargo?.cargoTypeName || '',
        cargoTariff: cargo?.cargoTariff || '',
        productName: cargo?.productName || '',
        cargoCustomCode: cargo?.cargoCustomCode || '',
        totalWeight: cargo?.totalWeight || 0,
        lengthCargo: cargo?.lengthCargo || 0,
        widthCargo: cargo?.widthCargo || 0,
        heightCargo: cargo?.heightCargo || 0,
        // quantity: cargo?.quantity || 0,
    }

    const validationSchema = Yup.object().shape({
        number: Yup.string().max(255),
        totalWeight: Yup.number().typeError('Значение должно быть числом'),
        lengthCargo: Yup.number().typeError('Значение должно быть числом'),
        widthCargo: Yup.number().typeError('Значение должно быть числом'),
        heightCargo: Yup.number().typeError('Значение должно быть числом'),
    })

    const handleUpdateProduct = async (values: WarehouseStateCargoRequest, formActions: { [key: string]: any }) => {
        try {
            // values.id = truck?.id;

            // await roadService.updateTruck(values)

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
                                                        {/*<Autocomplete*/}
                                                        {/*    options={customers}*/}
                                                        {/*    getOptionLabel={option => option.code}*/}
                                                        {/*    getOptionSelected={(option, value) => option.code === value.code}*/}
                                                        {/*    value={props.values.cargoCustomCode}*/}
                                                        {/*    onChange={(e, value) => {*/}
                                                        {/*        props.setFieldValue("type", value);*/}
                                                        {/*        props.setFieldValue("typeId", value?.id);*/}
                                                        {/*    }}*/}
                                                        {/*    renderInput={params => (*/}
                                                        {/*        <TextField*/}
                                                        {/*            error={Boolean(props.touched.typeId && props.errors.typeId)}*/}
                                                        {/*            helperText={props.touched.typeId && props.errors.typeId}*/}
                                                        {/*            label="Выберите тип машины"*/}
                                                        {/*            name="typeId"*/}
                                                        {/*            variant="outlined"*/}
                                                        {/*            onBlur={props.handleBlur}*/}
                                                        {/*            required*/}
                                                        {/*            {...params}*/}
                                                        {/*        />*/}
                                                        {/*    )}*/}
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
