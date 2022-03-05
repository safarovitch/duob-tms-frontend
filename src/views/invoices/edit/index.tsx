import React, {useEffect, useState} from "react";
import Page from "../../../components/Page";
import {
    Box,
    Breadcrumbs,
    Card,
    Container,
    Grid,
    Link,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {useParams} from "react-router";
import {GetListInvoiceResponse} from "../../../model/Invoice";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import invoiceService from "../../../services/InvoiceService";
import LoadingLayout from "../../../components/LoadingLayout";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import UpdateInvoiceButton from "./UpdateInvoiceButton";
import {CargoCustomCode, CargoProduct} from "../../../model/Cargo";
import cargoService from "../../../services/CargoService";
import RowInvoice from "./RowInvoice";
import RowInvoiceEdit from "./RowInvoiceEdit";
import DownloadInvoiceButton from "../DownloadInvoiceButton";
import {ProviderReceiver} from "../../../model/Road";
import roadService from "../../../services/RoadService";
import {Autocomplete} from "@material-ui/lab";
import {ProviderReceiverEnum} from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    mainContent: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        left: '14px',
        marginTop: '-14px',
    }
}));

enum InvoiceProperties {
    truckNumber = "truckNumber",
    trailerNumber = "trailerNumber",
    number = "number",
    providerId = "providerId",
    receiverId = "receiverId"
}

const Index: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const {id: invoiceId} = useParams<{ id: string }>()
    const [invoice, setInvoice] = useState<GetListInvoiceResponse>()
    const [cargoProducts, setCargoProducts] = useState<CargoProduct[]>([])
    const [cargoCustomCodes, setCargoCustomCodes] = useState<CargoCustomCode[]>([])
    const [providerReceivers, setProviderReceivers] = useState<ProviderReceiver[]>([])
    const [provider, setProvider] = useState<ProviderReceiver>()
    const [receiver, setReceiver] = useState<ProviderReceiver>()
    const [hasError, setHasError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [downloadLoading, setDownloadLoading] = useState(false)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await invoiceService.get(Number(invoiceId))
                const dataCargoProducts: any = await cargoService.getOptionProducts()
                const dataCargoCustomCodes: any = await cargoService.getFilteredCustomCodes(1, 10000, '')
                const dataProviderReceivers: any = await roadService.getProviderReceivers()

                if (!cancel) {
                    setInvoice(data)
                    setCargoProducts(dataCargoProducts.filter((pItem: CargoProduct) => dataCargoCustomCodes.content.find((ccItem: CargoCustomCode) => ccItem.productDto!.id === pItem.id)))
                    setCargoCustomCodes(dataCargoCustomCodes.content)
                    setProviderReceivers(dataProviderReceivers)
                    setProvider(dataProviderReceivers.find((item: ProviderReceiver) => item.id === data.providerId))
                    setReceiver(dataProviderReceivers.find((item: ProviderReceiver) => item.id === data.receiverId))
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
    }, [invoiceId, enqueueSnackbar])

    const handleStringInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, property: InvoiceProperties) => {
        event.persist()

        setInvoice({...invoice!, [property]: event.target.value})
    }

    const handleProviderReceiver = (value: number, property: InvoiceProperties) => {
        setInvoice({...invoice!, [property]: value})
    }

    const handleCurrency = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()

        if (isNaN(Number(event.target.value)) || (Number(event.target.value) < 0)) return;

        let newInvoice = {...invoice!}
        newInvoice.currency = (event.target.value as any)

        newInvoice.totalTjs = Number((newInvoice.totalUsd * Number(newInvoice.currency)).toFixed(2))
        newInvoice.ccPriceTjs = Number((newInvoice.ccPriceUsd * Number(newInvoice.currency)).toFixed(2))

        setInvoice(newInvoice)
    }

    const handlePercent = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()

        let percent: number = Number(event.target.value)
        isNaN(percent) && (percent = 0)
        percent < 0 && (percent = 0)
        percent > 100 && (percent = 100)

        let newInvoice = {...invoice!}
        newInvoice.percent = percent

        for (const cargoInvoice of newInvoice.cargoInvoiceProjection) {
            let customCode = getCustomCode(cargoInvoice.customCodeId)
            cargoInvoice.price = calculatePrice(cargoInvoice.weight, customCode.price!, cargoInvoice.quantity, newInvoice!.percent)
            cargoInvoice.totalPrice = calculateTotalPrice(cargoInvoice.quantity, cargoInvoice.price)
            cargoInvoice.ccPrice = calculateCcPrice(cargoInvoice.totalPrice, customCode.vat! + customCode.baseRate!)
        }

        setInvoice(calculateGeneralTotals(newInvoice))
    }

    const handleRowCustomCode = (index: number, value: CargoCustomCode) => {
        let newInvoice = {...invoice!}
        let cargoInvoice = {...newInvoice.cargoInvoiceProjection[index]!}
        let customCode = getCustomCode(cargoInvoice.customCodeId)

        cargoInvoice.customCodeId = value.id!
        cargoInvoice.productId = value.productDto!.id!
        cargoInvoice.price = calculatePrice(cargoInvoice.weight, customCode.price!, cargoInvoice.quantity, newInvoice!.percent)
        cargoInvoice.totalPrice = calculateTotalPrice(cargoInvoice.quantity, cargoInvoice.price)
        cargoInvoice.ccPrice = calculateCcPrice(cargoInvoice.totalPrice, customCode.vat! + customCode.baseRate!)

        newInvoice.cargoInvoiceProjection[index]! = cargoInvoice
        setInvoice(calculateGeneralTotals(newInvoice))
    }

    const handleRowQuantity = (index: number, value: number) => {
        let newInvoice = {...invoice!}
        let cargoInvoice = {...newInvoice.cargoInvoiceProjection[index]!}
        let customCode = getCustomCode(cargoInvoice.customCodeId)

        cargoInvoice.quantity = value
        cargoInvoice.price = calculatePrice(cargoInvoice.weight, customCode.price!, cargoInvoice.quantity, newInvoice!.percent)
        cargoInvoice.totalPrice = calculateTotalPrice(cargoInvoice.quantity, cargoInvoice.price)
        cargoInvoice.ccPrice = calculateCcPrice(cargoInvoice.totalPrice, customCode.vat! + customCode.baseRate!)

        newInvoice.cargoInvoiceProjection[index]! = cargoInvoice
        setInvoice(calculateGeneralTotals(newInvoice))
    }

    const handleRowWeight = (index: number, value: number) => {
        let newInvoice = {...invoice!}
        let cargoInvoice = {...newInvoice.cargoInvoiceProjection[index]!}
        let customCode = getCustomCode(cargoInvoice.customCodeId)

        cargoInvoice.weight = value
        cargoInvoice.quantity = calculateQuantity(cargoInvoice.weight, customCode.kgPerPlace)
        cargoInvoice.price = calculatePrice(cargoInvoice.weight, customCode.price!, cargoInvoice.quantity, newInvoice!.percent)
        cargoInvoice.totalPrice = calculateTotalPrice(cargoInvoice.quantity, cargoInvoice.price)
        cargoInvoice.ccPrice = calculateCcPrice(cargoInvoice.totalPrice, customCode.vat! + customCode.baseRate!)

        newInvoice.cargoInvoiceProjection[index]! = cargoInvoice
        setInvoice(calculateGeneralTotals(newInvoice))
    }

    const calculateQuantity = (weight: number, kgPerPlace: number) => {
        return kgPerPlace === 0 ? 0 : Math.round(weight / kgPerPlace);
    }

    const calculatePrice = (weight: number, customCodePrice: number, quantity: number, percent: number) => {
        return quantity === 0 ? 0 : Number(((weight * customCodePrice * percent) / (100000 * quantity)).toFixed(2));
    }

    const calculateTotalPrice = (quantity: number, price: number) => {
        return Number((quantity * price).toFixed(2));
    }

    const calculateCcPrice = (totalPrice: number, vatBaseRate: number) => {
        return Number(((totalPrice * vatBaseRate) / 100).toFixed(2));
    }

    const getCustomCode = (id: number) => {
        return cargoCustomCodes.find(item => item.id === id)!;
    }

    const calculateGeneralTotals = (newInvoice: GetListInvoiceResponse) => {
        let weight = 0
        let quantity = 0
        let totalUsd = 0
        let ccPriceUsd = 0

        for (const cargoInvoice of newInvoice.cargoInvoiceProjection) {
            weight += cargoInvoice.weight
            quantity += cargoInvoice.quantity
            totalUsd += cargoInvoice.totalPrice
            ccPriceUsd += cargoInvoice.ccPrice
        }

        newInvoice.weight = weight
        newInvoice.quantity = quantity
        newInvoice.totalUsd = Number(totalUsd.toFixed(2))
        newInvoice.totalTjs = Number((totalUsd * Number(newInvoice.currency)).toFixed(2))
        newInvoice.ccPriceUsd = Number(ccPriceUsd.toFixed(2))
        newInvoice.ccPriceTjs = Number((ccPriceUsd * Number(newInvoice.currency)).toFixed(2))

        return newInvoice
    }

    return (
        <Page title={invoice ? `Инвойс № ${1}` : 'Инвойс'}>
            {
                invoice && cargoProducts.length && cargoCustomCodes.length && provider && receiver ? (
                    <Container className={classes.root} maxWidth="xl">
                        <Box>
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
                                    to="/app/invoices"
                                    component={RouterLink}
                                >
                                    Инвойсы
                                </Link>
                                <Typography
                                    variant="body1"
                                    color="textPrimary"
                                >
                                    {`Инвойс ${invoice.number}`}
                                </Typography>
                            </Breadcrumbs>
                            <Typography
                                variant="h3"
                                color="textPrimary"
                            >
                                {`Инвойс ${invoice.number}`}
                            </Typography>
                        </Box>
                        <Card className={classes.mainContent}>
                            <Grid container justifyContent="space-between" spacing={2}>
                                <Grid item>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            {
                                                invoice.copy ? (
                                                    <>
                                                        <Box>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                label="Номер инвойса"
                                                                disabled={updateLoading || downloadLoading}
                                                                onChange={(e) => handleStringInput(e, InvoiceProperties.number)}
                                                                value={invoice.number || ''}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                        <Box mt={2}>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                label="Дата"
                                                                disabled={true}
                                                                value={invoice.createdDate}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                        <Box mt={2}>
                                                            <Autocomplete
                                                                options={providerReceivers.filter(item => item.type === ProviderReceiverEnum.PROVIDER)}
                                                                getOptionLabel={option => option.name}
                                                                getOptionSelected={(option, value) => option.name === value.name}
                                                                value={provider}
                                                                onChange={(e, value) => {
                                                                    e.persist()

                                                                    const newValue = value || provider
                                                                    setProvider(newValue)
                                                                    handleProviderReceiver(newValue.id!, InvoiceProperties.providerId)
                                                                }}
                                                                size="small"
                                                                disabled={updateLoading || downloadLoading}
                                                                renderInput={params => (
                                                                    <TextField
                                                                        label="Поставщик"
                                                                        variant="outlined"
                                                                        {...params}
                                                                    />
                                                                )}
                                                            />
                                                        </Box>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Box>
                                                            <Typography variant="h5">Номер инвойса: <b>{invoice.number}</b></Typography>
                                                        </Box>
                                                        <Box mt={2}>
                                                            <Typography variant="h5">Дата: <b>{invoice.createdDate}</b></Typography>
                                                        </Box>
                                                        <Box mt={2}>
                                                            <Typography variant="h5">Поставщик: <b>{provider.name}</b></Typography>
                                                        </Box>
                                                    </>
                                                )
                                            }
                                        </Grid>
                                        <Grid item>
                                            {
                                                invoice.copy ? (
                                                    <>
                                                        <Box>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                label="Курс"
                                                                disabled={updateLoading || downloadLoading}
                                                                onChange={handleCurrency}
                                                                value={invoice.currency}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                        <Box mt={2}>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                label="Номер машины"
                                                                disabled={updateLoading || downloadLoading}
                                                                onChange={(e) => handleStringInput(e, InvoiceProperties.truckNumber)}
                                                                value={invoice.truckNumber || ''}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                        <Box mt={2}>
                                                            <Autocomplete
                                                                options={providerReceivers.filter(item => item.type === ProviderReceiverEnum.RECEIVER)}
                                                                getOptionLabel={option => option.name}
                                                                getOptionSelected={(option, value) => option.name === value.name}
                                                                value={receiver}
                                                                onChange={(e, value) => {
                                                                    e.persist()

                                                                    const newValue = value || receiver
                                                                    setReceiver(newValue)
                                                                    handleProviderReceiver(newValue.id!, InvoiceProperties.receiverId)
                                                                }}
                                                                size="small"
                                                                disabled={updateLoading || downloadLoading}
                                                                renderInput={params => (
                                                                    <TextField
                                                                        label="Получатель"
                                                                        variant="outlined"
                                                                        {...params}
                                                                    />
                                                                )}
                                                            />
                                                        </Box>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Box>
                                                            <Typography variant="h5">Курс: <b>{invoice.currency}</b></Typography>
                                                        </Box>
                                                        <Box mt={2}>
                                                            <Typography variant="h5">Номер машины: <b>{invoice.truckNumber}</b></Typography>
                                                        </Box>
                                                        <Box mt={2}>
                                                            <Typography variant="h5">Получатель: <b>{receiver.name}</b></Typography>
                                                        </Box>
                                                    </>
                                                )
                                            }
                                        </Grid>
                                        <Grid item>
                                            {
                                                invoice.copy ? (
                                                    <>
                                                        <Box>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                label="Процент %"
                                                                disabled={updateLoading || downloadLoading}
                                                                onChange={handlePercent}
                                                                value={invoice.percent}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                        <Box mt={2}>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                label="Номер прицепа"
                                                                disabled={updateLoading || downloadLoading}
                                                                onChange={(e) => handleStringInput(e, InvoiceProperties.trailerNumber)}
                                                                value={invoice.trailerNumber || ''}
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Box>
                                                            <Typography variant="h5">Процент %: <b>{invoice.percent}</b></Typography>
                                                        </Box>
                                                        <Box mt={2}>
                                                            <Typography variant="h5">Номер прицепа: <b>{invoice.trailerNumber}</b></Typography>
                                                        </Box>
                                                    </>
                                                )
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container spacing={2}>
                                        {
                                            invoice.copy && (
                                                <Grid item>
                                                    <UpdateInvoiceButton
                                                        invoice={invoice}
                                                        onUpdate={invoiceService.update}
                                                        loading={updateLoading}
                                                        setLoading={setUpdateLoading}
                                                        disabled={downloadLoading}
                                                    />
                                                </Grid>
                                            )
                                        }
                                        <Grid item>
                                            <DownloadInvoiceButton
                                                invoiceNumber={invoice.number}
                                                invoiceId={invoice.id}
                                                loading={downloadLoading}
                                                setLoading={setDownloadLoading}
                                                disabled={updateLoading}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h5">Примечание: <b>{invoice.description}</b></Typography>
                                </Grid>
                            </Grid>
                            <Box mt={3}>
                                <Card>
                                    <PerfectScrollbar>
                                        <Box minWidth={700}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>№</TableCell>
                                                        <TableCell>Название</TableCell>
                                                        <TableCell>Категория</TableCell>
                                                        <TableCell>Цена категория</TableCell>
                                                        <TableCell>%</TableCell>
                                                        <TableCell>кг за 1 места</TableCell>
                                                        <TableCell>Кол-во</TableCell>
                                                        <TableCell>Вес</TableCell>
                                                        <TableCell>Цена</TableCell>
                                                        <TableCell>Сумма</TableCell>
                                                        <TableCell>Сумма растаможки</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {invoice.cargoInvoiceProjection.map((row, index) => {
                                                        return invoice.copy ? (
                                                            <RowInvoiceEdit
                                                                key={index}
                                                                row={row}
                                                                index={index}
                                                                cargoProducts={cargoProducts}
                                                                cargoCustomCodes={cargoCustomCodes}
                                                                handleRowCustomCode={handleRowCustomCode}
                                                                handleRowQuantity={handleRowQuantity}
                                                                handleRowWeight={handleRowWeight}
                                                                updateLoading={updateLoading || downloadLoading}
                                                            />
                                                        ) : (
                                                            <RowInvoice key={index} row={row} index={index}
                                                                        cargoProducts={cargoProducts}
                                                                        cargoCustomCodes={cargoCustomCodes}/>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </PerfectScrollbar>
                                </Card>
                            </Box>
                            <Box mt={3}>
                                <Grid container spacing={5} justifyContent="flex-end">
                                    <Grid item>
                                        <Typography variant="h5">
                                            Вес: <b>{invoice.weight}</b>
                                        </Typography>
                                        <Typography variant="h5">
                                            Количество: <b>{invoice.quantity}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h5">
                                            Сумма USD: <b>{invoice.totalUsd}</b>
                                        </Typography>
                                        <Typography variant="h5">
                                            Сумма TJS: <b>{invoice.totalTjs}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h5">
                                            Сумма растаможки USD: <b>{invoice.ccPriceUsd}</b>
                                        </Typography>
                                        <Typography variant="h5">
                                            Сумма растаможки TJS: <b>{invoice.ccPriceTjs}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    )
}

export default Index