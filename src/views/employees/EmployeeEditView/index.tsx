import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Box, Container, makeStyles} from '@material-ui/core';
import Page from '../../../components/Page';
import {Employee, Role} from "../../../model/Employee";
import {Warehouse} from "../../../model/Warehouse";
import warehouseService from "../../../services/WarehouseService";
import employeeService from "../../../services/EmployeeService";
import {deleteSelectedEmployee} from "../../../store/actions/employeeActions";
import Header from './Header';
import EmployeeEditForm from './EmployeeEditForm';
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const EmployeeEditView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const [roles, setRoles] = useState<Role[]>([])
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const selectedEmployee = useSelector(({selectedEmployee}: {selectedEmployee: Employee}) => selectedEmployee)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const dataRoles: any = await employeeService.getRoles()
                const dataWarehouses: any = await warehouseService.getAllWarehouse()

                setRoles(dataRoles)
                setWarehouses(dataWarehouses)
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()

        return () => {
            dispatch(deleteSelectedEmployee())
        }
    }, []);

    if (!selectedEmployee) {
        history.go(-1)
        return null
    }

    return (
        <Page title="Изменение сотрудника">
            {
                roles.length > 0 && warehouses.length > 0 ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Header />
                        <Box mt={3}>
                            <EmployeeEditForm employee={selectedEmployee} roles={roles} warehouses={warehouses} />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default EmployeeEditView;
