import React, {useEffect, useState} from "react";
import {Box, Button, Card, CardContent, Container, Grid, makeStyles, MenuItem, TextField} from "@material-ui/core";
import {useSnackbar} from "notistack";
import Page from "../../../components/Page";
import Header from "./Header";
import * as Yup from "yup";
import {Formik, FormikProps} from 'formik';
import {useHistory} from "react-router-dom";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {WarehouseSecondaryMoneyUnit} from "../../../model/Application";
import applicationService from "../../../services/Application";
import {Conversion} from "../../../model/Conversion";
import conversionService from "../../../services/ConversionService";
import {Currency} from "../../../constants";
import LoadingLayout from "../../../components/LoadingLayout";
import {needUpdateWarehouseBalance} from "../../../store/actions/warehouseActions";
import {useDispatch} from "react-redux";

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

const Index: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const dispatch = useDispatch()
    const [warehouseSecondaryMoneyUnit, setWarehouseSecondaryMoneyUnit] = useState<WarehouseSecondaryMoneyUnit>()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await applicationService.getWarehouseSecondaryMoneyUnit()

                setWarehouseSecondaryMoneyUnit(data)
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

    return () => {cancel = true}
    }, [enqueueSnackbar])

    const initialValues: Conversion = {
        actualAmount: 0,
        actualMoneyUnit: Currency.USD,
        currency: 0,
        convertAmount: 0,
        convertMoneyUnit: warehouseSecondaryMoneyUnit?.secondaryMoneyUnit || Currency.TJS,
        description: ''
    }

    const validationSchema = Yup.object().shape({
        message: Yup.string().max(255)
    })

    const handleAdd = async (values: Conversion, formActions: { [key: string]: any }) => {
        try {
            await conversionService.postNewConversion(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            dispatch(needUpdateWarehouseBalance())
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const calculateConvertAmount =
        (actualAmount: number, actualMoneyUnit: Currency, currency: number) => {
            isNaN(actualAmount) && (actualAmount = 0)
            isNaN(currency) && (currency = 0)

            return (actualMoneyUnit === Currency.USD ? actualAmount * currency
                : ((actualAmount === 0 || currency === 0) ? 0 : actualAmount / currency)).toFixed(2)
        }

    return (
        <Page title={'Создание уведомления'}>
            {
                warehouseSecondaryMoneyUnit ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header />
                        <Box mt={3}>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={
                                    async (values, {
                                        resetForm,
                                        setErrors,
                                        setStatus,
                                        setSubmitting
                                    }) => {
                                        setSubmitting(true)
                                        await handleAdd(values, {
                                            resetForm,
                                            setErrors,
                                            setStatus,
                                            setSubmitting
                                        })
                                    }
                                }
                            >
                                {(props: FormikProps<Conversion>) => (
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
                                                            error={Boolean(props.touched.actualAmount && props.errors.actualAmount)}
                                                            fullWidth
                                                            helperText={props.touched.actualAmount && props.errors.actualAmount}
                                                            label="Введите сумму"
                                                            placeholder="0"
                                                            name="actualAmount"
                                                            onBlur={props.handleBlur}
                                                            onChange={(e) => {
                                                                props.setFieldValue("convertAmount", calculateConvertAmount(Number(e.target.value), props.values.actualMoneyUnit, Number(props.values.currency)))
                                                                props.handleChange(e)
                                                            }}
                                                            value={props.values.actualAmount || ''}
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
                                                            select
                                                            error={Boolean(props.touched.actualMoneyUnit && props.errors.actualMoneyUnit)}
                                                            fullWidth
                                                            helperText={props.touched.actualMoneyUnit && props.errors.actualMoneyUnit}
                                                            label="Выберите валюту"
                                                            name="actualMoneyUnit"
                                                            onBlur={props.handleBlur}
                                                            onChange={(e) => {
                                                                props.setFieldValue("convertMoneyUnit", (e.target.value as Currency === Currency.USD ? warehouseSecondaryMoneyUnit.secondaryMoneyUnit : Currency.USD))
                                                                props.setFieldValue("convertAmount", calculateConvertAmount(Number(props.values.actualAmount), e.target.value as Currency, Number(props.values.currency)))
                                                                props.handleChange(e)
                                                            }}
                                                            value={props.values.actualMoneyUnit}
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
                                                            <MenuItem value={Currency.USD}>{Currency.USD}</MenuItem>
                                                            <MenuItem value={warehouseSecondaryMoneyUnit.secondaryMoneyUnit}>{warehouseSecondaryMoneyUnit.secondaryMoneyUnit}</MenuItem>
                                                        </TextField>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                    >
                                                        <TextField
                                                            error={Boolean(props.touched.currency && props.errors.currency)}
                                                            fullWidth
                                                            helperText={props.touched.currency && props.errors.currency}
                                                            label="Курс конвертации"
                                                            placeholder="0"
                                                            name="currency"
                                                            onBlur={props.handleBlur}
                                                            onChange={(e) => {
                                                                props.setFieldValue("convertAmount", calculateConvertAmount(Number(props.values.actualAmount), props.values.actualMoneyUnit, Number(e.target.value)))
                                                                props.handleChange(e)
                                                            }}
                                                            value={props.values.currency || ''}
                                                            variant="outlined"
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                    >
                                                        <TextField
                                                            select
                                                            fullWidth
                                                            label="Конвертационная валюта"
                                                            name="convertMoneyUnit"
                                                            value={props.values.convertMoneyUnit}
                                                            variant="outlined"
                                                            disabled
                                                        >
                                                            <MenuItem value={Currency.USD}>{Currency.USD}</MenuItem>
                                                            <MenuItem value={warehouseSecondaryMoneyUnit.secondaryMoneyUnit}>{warehouseSecondaryMoneyUnit.secondaryMoneyUnit}</MenuItem>
                                                        </TextField>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            label="Итого по курсу"
                                                            value={props.values.convertAmount}
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
                                                            label="Напишите коментарии"
                                                            name="description"
                                                            onBlur={props.handleBlur}
                                                            onChange={props.handleChange}
                                                            value={props.values.description}
                                                            variant="outlined"
                                                            multiline
                                                            rows={4}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Box mt={4} pb={1} className={classes.buttons}>
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
                                                        Отправить
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

export default Index