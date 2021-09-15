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
import {Warehouse, WarehouseFormProps} from "../../../model/Warehouse";
import warehouseService from "../../../services/WarehouseService";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteSelectedWarehouse} from "../../../store/actions/warehouseActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const useStyles = makeStyles((theme) => ({
    root: {},
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2),
        width: 177
    },
    buttonsWidth: {
        width: 177
    }
}));

interface WarehouseFormValues {
    name: string;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({className, warehouse}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    const initialValues: Warehouse = {
        name: warehouse?.name || '',
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
    })

    useEffect(() => () => {
        dispatch(deleteSelectedWarehouse())
    }, [])


    const handleAddWarehouse = async (values: Warehouse, formActions: { [key: string]: any }) => {
        try {
            await warehouseService.postNewWarehouse(values)

            enqueueSnackbar('Склад создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateWarehouse = async (values: Warehouse, formActions: { [key: string]: any }) => {
        try {
            values.id = warehouse?.id;

            await warehouseService.updateWarehouse(values)

            enqueueSnackbar('Склад обновлен', {variant: 'success'});
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
            validationSchema={!warehouse ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                warehouse ? await handleUpdateWarehouse(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleAddWarehouse(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<WarehouseFormValues>) => (
                <form
                    className={clsx(classes.root, className)}
                    onSubmit={props.handleSubmit}
                >
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        error={Boolean(props.touched.name && props.errors.name)}
                                        fullWidth
                                        autoFocus
                                        helperText={props.touched.name && props.errors.name}
                                        label="Название"
                                        placeholder="Введите название склада"
                                        name="name"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        required
                                        value={props.values.name}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
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
                                    className={classes.buttonsWidth}
                                >
                                    {warehouse ? 'Сохранить' : 'Создать'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default WarehouseForm;
