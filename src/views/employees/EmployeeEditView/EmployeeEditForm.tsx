import React from 'react';
import clsx from 'clsx';
import {
    makeStyles,
    Card,
    CardContent,
    Box,
    Button,
    Grid,
    TextField,
    InputLabel,
    Select,
    Input, MenuItem, Checkbox, ListItemText, FormControl
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {Link as RouterLink, useHistory} from "react-router-dom";
import {Employee, Role} from "../../../model/Employee";
import {useSnackbar} from "notistack";
import employeeService from "../../../services/EmployeeService";
import {Warehouse} from "../../../model/Warehouse";

const useStyles = makeStyles(theme => ({
    root: {},
    cancelButton: {
        background: 'white',
        boxShadow: '0 3px 3px rgba(0,0,0,0.10), 0 3px 3px rgba(0,0,0,0.15)'
    },
    submitButton: {
        marginLeft: theme.spacing(3),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const EmployeeEditForm: React.FC<{className?: string, employee: Employee, roles: Role[], warehouses: Warehouse[]}> =
    ({ className, employee, roles, warehouses, ...rest }) => {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const history = useHistory();

    const initialValues: Employee = {
        id: employee.id,
        name: employee.name,
        rolesId: (employee.roles!).map((role: Role) => role.id),
        username: employee.username,
        password: '',
        code: employee.code,
        birthdate: employee.birthdate,
        address: employee.address,
        phoneNumber: employee.phoneNumber,
        warehouseId: employee.warehouseDto?.id
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255).required('Name is required'),
        rolesId: Yup.array().min(1).required('role is required'),
        username: Yup.string().max(255).required('Login is required'),
        password: Yup.string().max(255),
        code: Yup.string().max(255).required('UserCode is required'),
        birthdate: Yup.string().max(255),
        address: Yup.string().max(255).required('Address is required'),
        phoneNumber: Yup.string().max(15),
        warehouseId: Yup.number().moreThan(0, 'Выберите склад').required('warehouse is required')
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                try {
                    await employeeService.updateEmployee(values)

                    enqueueSnackbar('Сотрудник обновлен', {
                        variant: 'success',
                        action: <Button onClick={() => history.push('/app/employees')}>Сотрудники</Button>
                    })
                } catch (error) {
                    setStatus({ success: false });
                    setErrors(error.message);
                    setSubmitting(false);
                    enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                        variant: 'error',
                        action: key => (<Button onClick={() => {closeSnackbar(key)}}>OK</Button>)
                    })
                }
            }}
        >
            {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values
              }) => (
                <form
                    className={clsx(classes.root, className)}
                    onSubmit={handleSubmit}
                    {...rest}
                >
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(touched.name && errors.name)}
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        label="ФИО"
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder="ФИО"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(touched.username && errors.username)}
                                        fullWidth
                                        helperText={touched.username && errors.username}
                                        label="Логин"
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.username}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder="Введите логин"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl className={classes.formControl} fullWidth>
                                        <InputLabel id="roles-multiple-checkbox-label">Должность</InputLabel>
                                        <Select
                                            labelId="roles-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            error={Boolean(touched.rolesId && errors.rolesId)}
                                            value={values.rolesId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="rolesId"
                                            input={<Input />}
                                            renderValue={
                                                (selected) => {
                                                    let newSelected: string[] = (selected as number[]).map((number) => {
                                                        let res =  roles.find((role) => role.id === number);
                                                        return res ? res.name: ''
                                                    })

                                                    return newSelected.join(', ')
                                                }
                                            }
                                            MenuProps={MenuProps}
                                        >
                                            {roles.map((role: Role) => (
                                                <MenuItem key={role.id} value={role.id}>
                                                    <Checkbox checked={values.rolesId.indexOf(role.id as never) > -1} />
                                                    <ListItemText primary={role.name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(touched.password && errors.password)}
                                        fullWidth
                                        helperText={touched.password && errors.password}
                                        label="Пароль"
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder="Введите пароль"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        select
                                        error={Boolean(touched.warehouseId && errors.warehouseId)}
                                        fullWidth
                                        helperText={touched.warehouseId && errors.warehouseId}
                                        label="Склад"
                                        name="warehouseId"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.warehouseId}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    >
                                        <MenuItem value={0} disabled>Выберите склад</MenuItem>
                                        {warehouses.map((warehouse) => (
                                            <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(touched.code && errors.code)}
                                        fullWidth
                                        helperText={touched.code && errors.code}
                                        label="Код пользователя"
                                        name="code"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.code}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder="Введите код пользователя"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(touched.birthdate && errors.birthdate)}
                                        fullWidth
                                        type="date"
                                        helperText={touched.birthdate && errors.birthdate}
                                        label="Дата рождение"
                                        name="birthdate"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.birthdate}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(touched.address && errors.address)}
                                        fullWidth
                                        helperText={touched.address && errors.address}
                                        label="Адрес проживание"
                                        name="address"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.address}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder="Введите адрес проживание"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                        fullWidth
                                        helperText={touched.phoneNumber && errors.phoneNumber}
                                        label="Телефон"
                                        name="phoneNumber"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.phoneNumber}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder="Введите номер"
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={2}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="flex-end"
                                >
                                    <Button
                                        variant="contained"
                                        color="default"
                                        to="/app/employees"
                                        component={RouterLink}
                                        className={classes.cancelButton}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={classes.submitButton}
                                    >
                                        Обновить
                                    </Button>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default EmployeeEditForm;
