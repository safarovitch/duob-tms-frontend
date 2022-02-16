import React from "react";
import {
    Box,
    Breadcrumbs, Button,
    Card,
    CardContent,
    Container,
    Grid,
    Link,
    makeStyles, MenuItem,
    TextField,
    Typography
} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {useSnackbar} from "notistack";
import {ProviderReceiver} from "../../../model/Road";
import * as Yup from "yup";
import {mapOfProviderReceiverEnum, ProviderReceiverEnum} from "../../../constants";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import roadService from "../../../services/RoadService";
import {Formik, FormikProps} from "formik";

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
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()

    const initialValues: ProviderReceiver = {
        name: '',
        inn: '',
        address: '',
        country: '',
        type: '' as ProviderReceiverEnum
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        inn: Yup.string().max(255),
        address: Yup.string().max(255),
        country: Yup.string().max(255)
    })

    const handleCreate = async (values: ProviderReceiver, formActions: { [key: string]: any }) => {
        try {
            await roadService.postProviderReceiver(values)

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
        <Page className={classes.root} title={'Получатели / Отправители'}>
            <Container maxWidth="md">
                <>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
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
                            to="/app/road"
                            component={RouterLink}
                        >
                            Константы рейса
                        </Link>
                        <Link
                            variant="body1"
                            color="inherit"
                            to="/app/road/provider-receiver"
                            component={RouterLink}
                        >
                            Получатели / Отправители
                        </Link>
                        <Typography
                            variant="body1"
                            color="textPrimary"
                        >
                            Создание
                        </Typography>
                    </Breadcrumbs>
                    <Typography
                        variant="h3"
                        color="textPrimary"
                    >
                        Создание
                    </Typography>
                </>
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
                        {(props: FormikProps<ProviderReceiver>) => (
                            <form onSubmit={props.handleSubmit}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                            >
                                                <TextField
                                                    select
                                                    error={Boolean(props.touched.type && props.errors.type)}
                                                    fullWidth
                                                    helperText={props.touched.type && props.errors.type}
                                                    label="Выберите тип"
                                                    name="type"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.type}
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
                                                        Object.keys(ProviderReceiverEnum).map((key, index) => (
                                                                <MenuItem key={index} value={ProviderReceiverEnum[key as ProviderReceiverEnum]}>{mapOfProviderReceiverEnum.get(ProviderReceiverEnum[key as ProviderReceiverEnum])}</MenuItem>
                                                        ))
                                                    }
                                                </TextField>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                            >
                                                <TextField
                                                    error={Boolean(props.touched.name && props.errors.name)}
                                                    fullWidth
                                                    helperText={props.touched.name && props.errors.name}
                                                    label="Введите название"
                                                    name="name"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.name}
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
                                                    error={Boolean(props.touched.inn && props.errors.inn)}
                                                    fullWidth
                                                    helperText={props.touched.inn && props.errors.inn}
                                                    label="Введите ИНН"
                                                    name="inn"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.inn}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                            >
                                                <TextField
                                                    error={Boolean(props.touched.address && props.errors.address)}
                                                    fullWidth
                                                    helperText={props.touched.address && props.errors.address}
                                                    label="Введите адрес"
                                                    name="address"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.address}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                            >
                                                <TextField
                                                    error={Boolean(props.touched.country && props.errors.country)}
                                                    fullWidth
                                                    helperText={props.touched.country && props.errors.country}
                                                    label="Введите страну"
                                                    name="country"
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values.country}
                                                    variant="outlined"
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
        </Page>
    )
}

export default CreateView