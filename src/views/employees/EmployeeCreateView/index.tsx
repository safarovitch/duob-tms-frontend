import React, {useEffect, useState} from 'react';
import {Box, Button, Container, makeStyles} from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import EmployeeCreateForm from './EmployeeCreateForm';
import {Role} from "../../../model/Employee";
import employeeService from "../../../services/EmployeeService";
import {useSnackbar} from "notistack";
import warehouseService from "../../../services/WarehouseService";
import {Warehouse} from "../../../model/Warehouse";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const EmployeeCreateView: React.FC = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [roles, setRoles] = useState<[] | Role[]>([]);
    const [warehouses, setWarehouses] = useState<[] | Warehouse[]>([]);

    useEffect(() => {
        const getRoles = async () => {
            try {
                const roles = await employeeService.getRoles();
                setRoles(roles as Role[]);
            } catch (error: any) {
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
            } catch (error: any) {
                enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                    variant: 'error',
                    action: <Button onClick={() => getWarehouses()}>Рестарт</Button>
                });
            }
        }

        getRoles().then(null)
        getWarehouses().then(null)
    }, [enqueueSnackbar])

    if (roles.length === 0 || warehouses.length === 0) return null;

    return (
        <Page className={classes.root} title="Создание сотрудника">
            <Container maxWidth={false}>
                <Header />
                <Box mt={3}>
                    <EmployeeCreateForm roles={roles} warehouses={warehouses} />
                </Box>
            </Container>
        </Page>
    );
}

export default EmployeeCreateView;
