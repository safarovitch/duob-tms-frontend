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
    Checkbox,
    Grid,
    makeStyles,
    MenuItem,
    TextField,
    Typography
} from '@material-ui/core';
import {Warehouse, WarehouseFormProps} from "../../../model/Warehouse";
import warehouseService from "../../../services/WarehouseService";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteSelectedWarehouse} from "../../../store/actions/warehouseActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Currency} from "../../../constants";

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
    },
    checkbox: {
        display: 'flex'
    },
    checkboxLabel: {
        marginTop: 8
    }
}));

const WarehouseForm: React.FC<WarehouseFormProps> = ({className, warehouse}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    const initialValues: Warehouse = {
        name: warehouse?.name || '',
        secondaryMoneyUnit: '' as Currency,
        destination: warehouse?.destination || false
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
    })

    useEffect(() => () => {
        dispatch(deleteSelectedWarehouse())
    }, [dispatch])

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
            {(props: FormikProps<Warehouse>) => (
                <form
                    className={clsx(classes.root, className)}
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
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        select
                                        error={Boolean(props.touched.secondaryMoneyUnit && props.errors.secondaryMoneyUnit)}
                                        fullWidth
                                        helperText={props.touched.secondaryMoneyUnit && props.errors.secondaryMoneyUnit}
                                        label="Выберите валюту"
                                        name="secondaryMoneyUnit"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.secondaryMoneyUnit}
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
                                            Object.keys(Currency).map((value, index) => (
                                                <MenuItem key={index} value={value}>{value}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <label onClick={props.handleChange} className={classes.checkbox}>
                                        <Checkbox
                                            checked={props.values.destination}
                                            name="destination"
                                            color="primary"
                                            onChange={props.handleChange}
                                        />
                                        <Typography variant="subtitle1" className={classes.checkboxLabel}>
                                            Склад назначения
                                        </Typography>
                                    </label>
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
