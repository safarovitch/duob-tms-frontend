import React, {useEffect} from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik, FormikProps} from 'formik';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    makeStyles
} from '@material-ui/core';
import {CreditCreateRequest} from "../../../model/Customer";
import customerService from "../../../services/CustomerService";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteSelectedCustomer} from "../../../store/actions/customerActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {User} from "../../../model/User";

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

const CreditForm: React.FC<{className?: string, id: number}> = ({
                                                       className,
    id
                                                   }) => {
    const classes = useStyles();
    const user = useSelector((state: {user: User}) => state.user);
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedCustomer())
    }, [dispatch])

    const initialValues: CreditCreateRequest = {
        amount: undefined,
        description: '',
        clientId: id,
        warehouseId: user.warehouseId!
    }

    const validationSchema = Yup.object().shape({
        amount: Yup.number(),
        description: Yup.string().max(255)
    })

    const handleAddCredit = async (values: CreditCreateRequest, formActions: { [key: string]: any }) => {
        try {
            values.amount = Number(values.amount)
            await customerService.addCredit(values)

            enqueueSnackbar('Кредит оформлен', {variant: 'success'});
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
            validationSchema={validationSchema}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                await handleAddCredit(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<CreditCreateRequest>) => (
                <form
                    className={clsx(classes.root, className)}
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
                                        error={Boolean(props.touched.amount && props.errors.amount)}
                                        fullWidth
                                        helperText={props.touched.amount && props.errors.amount}
                                        label="Сумма"
                                        name="amount"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.amount}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.description && props.errors.description)}
                                        fullWidth
                                        helperText={props.touched.description && props.errors.description}
                                        label="Комментарии"
                                        name="description"
                                        required
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.description}
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
                                    {'Оформить'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default CreditForm;
