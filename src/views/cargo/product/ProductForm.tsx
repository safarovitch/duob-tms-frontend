import React, {useEffect} from 'react';
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
    makeStyles, Container
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {CargoProduct, ProductFormProps} from "../../../model/Cargo";
import cargoService from "../../../services/CargoService";
import {deleteSelectedProduct} from "../../../store/actions/cargoActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";

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


const ProductForm: React.FC<ProductFormProps> = (props: ProductFormProps) => {
    const {product} = props;
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedProduct())
    }, [])

    const initialValues: CargoProduct = {
        name: product?.name || ''
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255)
    })

    const handleAddProduct = async (values: CargoProduct, formActions: { [key: string]: any }) => {
        try {
            formActions.setStatus({success: true});
            formActions.setSubmitting(false);
            await cargoService.postProduct(values)
            enqueueSnackbar('Наименование создано', {
                variant: 'success',
                action: <Button>ОК</Button>
            });
            history.go(-1);
            formActions.resetForm();
        } catch (error) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateProduct = async (values: CargoProduct, formActions: { [key: string]: any }) => {
        try {
            formActions.setStatus({success: true});
            formActions.setSubmitting(false);
            values.id = product?.id;
            await cargoService.updateProduct(values)
            enqueueSnackbar('Наименование обновлено', {
                variant: 'success',
                action: <Button>ОК</Button>
            });
            history.go(-1);
        } catch (error) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Container maxWidth="sm">
            <Formik
                initialValues={initialValues}
                validationSchema={!product ? validationSchema : null}
                onSubmit={async (values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) => {
                    setSubmitting(true)
                    product ? await handleUpdateProduct(values, {
                        resetForm,
                        setErrors,
                        setStatus,
                        setSubmitting
                    }) : await handleAddProduct(values, {
                        resetForm,
                        setErrors,
                        setStatus,
                        setSubmitting
                    })
                }}
            >
                {(props: FormikProps<CargoProduct>) => (
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
                                        md={12}
                                        xs={12}
                                    >
                                        <TextField
                                            error={Boolean(props.touched.name && props.errors.name)}
                                            fullWidth
                                            helperText={props.touched.name && props.errors.name}
                                            label="Наименование груза"
                                            name="name"
                                            onBlur={props.handleBlur}
                                            onChange={props.handleChange}
                                            required
                                            value={props.values.name}
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
                                        {product ? 'Сохранить' : 'Добавить'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </form>
                )}
            </Formik>
        </Container>
    );
}

export default ProductForm;
