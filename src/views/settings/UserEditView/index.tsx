import React, {useEffect, useState} from 'react';
import {Box, Button, Container, makeStyles} from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import UserEditForm from './UserEditForm';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Employee, Role} from "../../../model/Employee";
import employeeService from "../../../services/EmployeeService";
import {useSnackbar} from "notistack";
import {Warehouse} from "../../../model/Warehouse";
import warehouseService from "../../../services/WarehouseService";
import {deleteSelectedEmployee} from "../../../store/actions/employeeActions";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const UserEditView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const [roles, setRoles] = useState<[] | Role[]>([])
    const [warehouses, setWarehouses] = useState<[] | Warehouse[]>([])
    const selectedEmployee = useSelector(({selectedEmployee}: {selectedEmployee: Employee}) => selectedEmployee)

    useEffect(() => {
        if (!selectedEmployee) history.push('/app/employees');
        else {
            const getRoles = async () => {
                try {
                    const roles = await employeeService.getRoles();
                    setRoles(roles as Role[]);
                } catch (error) {
                    enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                        variant: 'error',
                        action: <Button onClick={() => getRoles()}>Рестарт</Button>
                    });
                }
            }

            const getWarehouses = async () => {
                try {
                    const warehouses = await warehouseService.getAllWarehouse()
                    setWarehouses(warehouses as Warehouse[])
                } catch (error) {
                    enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                        variant: 'error',
                        action: <Button onClick={() => getWarehouses()}>Рестарт</Button>
                    });
                }
            }

            getRoles().then(null)
            getWarehouses().then(null)
        }

        return () => {
            dispatch(deleteSelectedEmployee())
        }
    }, [enqueueSnackbar]);

    if (roles.length === 0 || warehouses.length === 0) return null;

    return (
        <Page className={classes.root} title="Изменение сотрудника">
            <Container maxWidth="lg">
                <Header />
                <Box mt={3}>
                    <UserEditForm employee={selectedEmployee!} roles={roles} warehouses={warehouses} />
                </Box>
            </Container>
        </Page>
    );
}

export default UserEditView;
