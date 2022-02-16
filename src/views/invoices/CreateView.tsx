import React, {useEffect, useState} from "react";
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
    TextField,
    Typography
} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Page from "../../components/Page";
import {CreateInvoiceRequest, GetRoadsResponse} from "../../model/Invoice";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../utils/errorMessageHandler";
import LoadingLayout from "../../components/LoadingLayout";
import * as Yup from "yup";
import invoiceService from "../../services/InvoiceService";
import {Formik, FormikProps} from "formik";
import {Autocomplete} from "@material-ui/lab";
import roadService from "../../services/RoadService";
import {ProviderReceiverEnum} from "../../constants";
import {ProviderReceiver} from "../../model/Road";

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

const CreateView: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [roads, setRoads] = useState<GetRoadsResponse[]>([])
    const [providerReceivers, setProviderReceivers] = useState<ProviderReceiver[]>([])
    const [road, setRoad] = useState<GetRoadsResponse>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                const dataRoads: any = await invoiceService.getRoads()
                const dataProviderReceivers: any = await roadService.getProviderReceivers()

                if (dataRoads.length === 0 || dataProviderReceivers.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала рейс или Получатель / Отправитель', {variant: 'info'})
                } else if (!cancel) {
                    setRoads(dataRoads)
                    setProviderReceivers(dataProviderReceivers)
                }
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [history, enqueueSnackbar])

    const initialValues: CreateInvoiceRequest = {
        roadId: 0,
        percent: 100,
        providerId: 0,
        receiverId: 0,
        number: '',
        description: ''
    }

    const validationSchema = Yup.object().shape({
        percent: Yup.number().typeError('Значение должно быть числом'),
        provider: Yup.string().max(255),
        receiver: Yup.string().max(255),
        number: Yup.string().max(255),
        description: Yup.string().max(255)
    })

    const handleCreate = async (values: CreateInvoiceRequest, formActions: { [key: string]: any }) => {
        try {
            values.description = road!.road

            await invoiceService.post(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Page title={'Создание инвойса'}>
            {
                roads.length > 0 ? (
                    <Container className={classes.root} maxWidth="md">
                        <Box>
                            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
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
                                <Typography variant="body1" color="textPrimary">Создание</Typography>
                            </Breadcrumbs>
                            <Typography variant="h3" color="textPrimary">Создание инвойса</Typography>
                        </Box>
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
                                    await handleCreate(values, {
                                        resetForm,
                                        setErrors,
                                        setStatus,
                                        setSubmitting
                                    })
                                }}
                            >
                                {(props: FormikProps<CreateInvoiceRequest>) => (
                                    <form
                                        onSubmit={props.handleSubmit}
                                    >
                                        <Card>
                                            <CardContent>
                                                <Grid container spacing={3}>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={6}
                                                    >
                                                        <Autocomplete
                                                            options={roads}
                                                            getOptionLabel={option => `Рейс ${option.id} - ${option.road}`}
                                                            getOptionSelected={(option, value) => option.road === value.road}
                                                            onChange={(e, value) => {
                                                                props.setFieldValue("roadId", value?.id);
                                                                setRoad(value || undefined)
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    error={Boolean(props.touched.roadId && props.errors.roadId)}
                                                                    helperText={props.touched.roadId && props.errors.roadId}
                                                                    label="Выберите рейс"
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
                                                        sm={6}
                                                    >
                                                        <TextField
                                                            error={Boolean(props.touched.number && props.errors.number)}
                                                            fullWidth
                                                            helperText={props.touched.number && props.errors.number}
                                                            label="Введите номер инвойса"
                                                            name="number"
                                                            onBlur={props.handleBlur}
                                                            onChange={props.handleChange}
                                                            value={props.values.number}
                                                            variant="outlined"
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={6}
                                                    >
                                                        <Autocomplete
                                                            options={providerReceivers.filter(item => item.type === ProviderReceiverEnum.PROVIDER)}
                                                            getOptionLabel={option => option.name}
                                                            getOptionSelected={(option, value) => option.name === value.name}
                                                            onChange={(e, value) => {
                                                                props.setFieldValue("providerId", value?.id);
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    error={Boolean(props.touched.providerId && props.errors.providerId)}
                                                                    helperText={props.touched.providerId && props.errors.providerId}
                                                                    label="Выберите поставшика"
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
                                                        sm={6}
                                                    >
                                                        <Autocomplete
                                                            options={providerReceivers.filter(item => item.type === ProviderReceiverEnum.RECEIVER)}
                                                            getOptionLabel={option => option.name}
                                                            getOptionSelected={(option, value) => option.name === value.name}
                                                            onChange={(e, value) => {
                                                                props.setFieldValue("receiverId", value?.id);
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    error={Boolean(props.touched.receiverId && props.errors.receiverId)}
                                                                    helperText={props.touched.receiverId && props.errors.receiverId}
                                                                    label="Выберите получателья"
                                                                    variant="outlined"
                                                                    onBlur={props.handleBlur}
                                                                    required
                                                                    {...params}
                                                                />
                                                            )}
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
                                                        Добавить
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    )
}

export default CreateView