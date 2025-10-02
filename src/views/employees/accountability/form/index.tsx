import React, {useEffect} from 'react';
import {Box, Button, Card, CardContent, Container, Grid, makeStyles, MenuItem, TextField} from '@material-ui/core';
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
import {
    AccountabilityMoneyUnit,
    AccountabilityType,
    mapOfAccountabilityType,
} from "../../../../constants";

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
    const dispatch = useDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const accountability = useSelector((state: { selectedEmployeeAccountability: Accountability }) => state.selectedEmployeeAccountability)
    const {employeeId} = useParams<{employeeId: string}>()

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
        amount: accountability?.amount || 0,
        moneyUnit: accountability?.moneyUnit || '',
        employeeId: Number(employeeId)
    }

    const validationSchema = Yup.object().shape({
        amount: Yup.number().typeError('Значение должно быть числом'),
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

    return (
        <Page className={classes.root} title={accountability ? 'Редактирование подотчета':'Создание подотчета'}>
            <Container maxWidth="md">
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
                                                    md={4}
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
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                >
                                                    <TextField
                                                        error={Boolean(props.touched.amount && props.errors.amount)}
                                                        fullWidth
                                                        helperText={props.touched.amount && props.errors.amount}
                                                        label="Введите сумму"
                                                        placeholder="0"
                                                        name="amount"
                                                        onBlur={props.handleBlur}
                                                        onChange={props.handleChange}
                                                        value={props.values.amount || ''}
                                                        variant="outlined"
                                                        required
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                >
                                                    <TextField
                                                        select
                                                        error={Boolean(props.touched.moneyUnit && props.errors.moneyUnit)}
                                                        fullWidth
                                                        helperText={props.touched.moneyUnit && props.errors.moneyUnit}
                                                        label="Выберите валюту"
                                                        name="moneyUnit"
                                                        onBlur={props.handleBlur}
                                                        onChange={props.handleChange}
                                                        value={props.values.moneyUnit}
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
                                                            (Object.keys(AccountabilityMoneyUnit) as Array<keyof typeof AccountabilityMoneyUnit>).map((type, index) => (
                                                                <MenuItem key={index} value={type}>{type}</MenuItem>
                                                            ))
                                                        }
                                                    </TextField>
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
        </Page>
    );
}

export default Index;
