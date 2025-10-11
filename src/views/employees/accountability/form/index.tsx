import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    makeStyles,
    MenuItem,
    TextField,
    Typography
} from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import Page from "../../../../components/Page";
import {Accountability} from "../../../../model/Employee";
import Header from "./Header";
import {useParams} from "react-router";
import {deleteSelectedEmployeeAccountability} from "../../../../store/actions/employeeActions";
import * as Yup from "yup";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import employeeService from "../../../../services/EmployeeService";
import {Formik, FormikProps} from "formik";
import {AccountabilityType, Currency, mapOfAccountabilityType,} from "../../../../constants";
import {WarehouseSecondaryMoneyUnit} from "../../../../model/Application";
import applicationService from "../../../../services/ApplicationService";
import LoadingLayout from "../../../../components/LoadingLayout";

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
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [warehouseSecondaryMoneyUnit, setWarehouseSecondaryMoneyUnit] =
        useState<WarehouseSecondaryMoneyUnit>({secondaryMoneyUnit: Currency.USD, secondaryMoneyCurrency: 1})
    const accountability = useSelector((state: { selectedEmployeeAccountability: Accountability }) => state.selectedEmployeeAccountability)
    const {employeeId} = useParams<{employeeId: string}>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const dataWarehouseSecondaryMoneyUnit: any = await applicationService.getWarehouseSecondaryMoneyUnit()

                setWarehouseSecondaryMoneyUnit(dataWarehouseSecondaryMoneyUnit)
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [history, enqueueSnackbar])


    useEffect(() => () => {
        dispatch(deleteSelectedEmployeeAccountability())
    }, [dispatch])

    if (!accountability && history.location.pathname.includes('edit')) {
        history.go(-1)
        return null
    }

    const initialValues: Accountability = {
        type: accountability?.type || '',
        description: accountability?.description || '',
        employeeId: Number(employeeId),
        actualAmount: accountability?.actualAmount || 0,
        actualMoneyUnit: Currency.USD,
        convertAmount: accountability?.convertAmount || 0,
        convertMoneyUnit: warehouseSecondaryMoneyUnit.secondaryMoneyUnit,
        currency: warehouseSecondaryMoneyUnit.secondaryMoneyCurrency,
        totalConvertAmount: Number(((accountability?.totalAmount || 0) - (accountability?.actualAmount || 0)).toFixed(2)),
        totalAmount: accountability?.totalAmount || 0,
    }

    const validationSchema = Yup.object().shape({
        description: Yup.string().max(255)
    })

    const handleCreate = async (values: Accountability, formActions: { [key: string]: any }) => {
        try {
            await employeeService.createEmployeeAccountability(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: Accountability, formActions: { [key: string]: any }) => {
        try {
            values.id = accountability?.id;

            await employeeService.updateEmployeeAccountability(values)

            enqueueSnackbar('Успешно обновлено', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const calculateTotalAmount = (actualAmount: number, convertAmount: number) => {
        isNaN(actualAmount) && (actualAmount = 0)
        isNaN(convertAmount) && (convertAmount = 0)

        return (actualAmount + convertAmount).toFixed(2);
    }

    const calculateTotalConvertAmount = (convertAmount: number) => {
        isNaN(convertAmount) && (convertAmount = 0)
        return Number((convertAmount === 0 ? 0 : convertAmount / warehouseSecondaryMoneyUnit.secondaryMoneyCurrency).toFixed(2))
    }

    return (
        <Page title={accountability ? 'Редактирование подотчета':'Создание подотчета'}>
            {
                warehouseSecondaryMoneyUnit.secondaryMoneyUnit !== Currency.USD ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header employeeId={employeeId} accountability={accountability} />
                        <Box mt={3}>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={!accountability ? validationSchema : null}
                                onSubmit={async (values, {
                                    resetForm,
                                    setErrors,
                                    setStatus,
                                    setSubmitting
                                }) => {
                                    setSubmitting(true)
                                    accountability ? await handleUpdate(values, {
                                        resetForm,
                                        setErrors,
                                        setStatus,
                                        setSubmitting
                                    }) : await handleCreate(values, {
                                        resetForm,
                                        setErrors,
                                        setStatus,
                                        setSubmitting
                                    })
                                }}
                            >
                                {(props: FormikProps<Accountability>) => (
                                    <form
                                        onSubmit={props.handleSubmit}
                                    >
                                        <Card>
                                            <Box py={1}>
                                                <CardContent>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                    >
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
                                                                label="Выберите действие"
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
                                                                    (Object.keys(AccountabilityType) as Array<keyof typeof AccountabilityType>).map((type, index) => (
                                                                        <MenuItem key={index} value={type}>{mapOfAccountabilityType.get(AccountabilityType[type])}</MenuItem>
                                                                    ))
                                                                }
                                                            </TextField>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} />
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={6}
                                                        >
                                                            <TextField
                                                                error={Boolean(props.touched.actualAmount && props.errors.actualAmount)}
                                                                fullWidth
                                                                helperText={props.touched.actualAmount && props.errors.actualAmount}
                                                                label={`Введите сумму ${Currency.USD}`}
                                                                placeholder="0"
                                                                name="actualAmount"
                                                                onBlur={props.handleBlur}
                                                                onChange={(e) => {
                                                                    props.setFieldValue("totalAmount", calculateTotalAmount(Number(e.target.value), props.values.totalConvertAmount!))
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
                                                                error={Boolean(props.touched.convertAmount && props.errors.convertAmount)}
                                                                fullWidth
                                                                helperText={props.touched.convertAmount && props.errors.convertAmount}
                                                                label={`Введите сумму ${warehouseSecondaryMoneyUnit.secondaryMoneyUnit}`}
                                                                placeholder="0"
                                                                name="convertAmount"
                                                                onBlur={props.handleBlur}
                                                                onChange={(e) => {
                                                                    let res = calculateTotalConvertAmount(Number(e.target.value))
                                                                    props.setFieldValue("totalConvertAmount", res)
                                                                    props.setFieldValue("totalAmount", calculateTotalAmount(Number(props.values.actualAmount), res))
                                                                    props.handleChange(e)
                                                                }}
                                                                value={props.values.convertAmount || ''}
                                                                variant="outlined"
                                                                required
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={6}
                                                        >
                                                            <Typography>Курс конвертации: {warehouseSecondaryMoneyUnit.secondaryMoneyCurrency}</Typography>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            sm={6}
                                                        >
                                                            <Typography>Итого по курсу: {props.values.totalConvertAmount} {Currency.USD}</Typography>
                                                            <Box pt={2}>
                                                                <Typography><b>Итого: {props.values.totalAmount} {Currency.USD}</b></Typography>
                                                            </Box>
                                                        </Grid>
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
                                                            {accountability ? 'Сохранить' : 'Создать'}
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Box>
                                        </Card>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default Index;
