import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {Box, Container, makeStyles} from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import EmployeeCreateForm from './EmployeeCreateForm';
import employeeService from "../../../services/EmployeeService";
import warehouseService from "../../../services/WarehouseService";
import {Role} from "../../../model/Employee";
import {Warehouse} from "../../../model/Warehouse";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";
import {useHistory} from "react-router";

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
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar();
    const [roles, setRoles] = useState<Role[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const dataRoles: any = await employeeService.getRoles()
                const dataWarehouses: any = await warehouseService.getAllWarehouse()

                if (dataWarehouses.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала склад', {variant: 'info'})
                } else {
                    setRoles(dataRoles)
                    setWarehouses(dataWarehouses)
                }
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <Page title="Создание сотрудника">
            {
                roles.length > 0 && warehouses.length > 0 ? (
                    <Container className={classes.root}  maxWidth="lg">
                        <Header />
                        <Box mt={3}>
                            <EmployeeCreateForm roles={roles} warehouses={warehouses} />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default EmployeeCreateView;
