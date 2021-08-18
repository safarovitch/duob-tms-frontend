import React, {useEffect, useState} from 'react';
import {Box, Button, Container, makeStyles} from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import UserEditForm from './UserEditForm';
import {useSelector} from "react-redux";
import {employeeInitialState} from "../../../store/reducers/employeeReducer";
import {useHistory} from "react-router-dom";
import {Role} from "../../../model/Employee";
import employeeService from "../../../services/employeeService";
import {useSnackbar} from "notistack";

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
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [roles, setRoles] = useState<[] | Role[]>([]);
    const employee = useSelector(({employee}: {employee: employeeInitialState}) => employee.selectedEmployee)

    useEffect(() => {
        if (!employee) history.push('/app/employees');
        else getRoles().then(null)
    });

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

    if (roles.length === 0 || !employee) return null;

    return (
        <Page className={classes.root} title="Изменение пользователя">
            <Container maxWidth="lg">
                <Header />
                <Box mt={3}>
                    <UserEditForm employee={employee!} roles={roles} />
                </Box>
            </Container>
        </Page>
    );
}

export default UserEditView;
