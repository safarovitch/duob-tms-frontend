import React, {
    useEffect, useState,
} from 'react';
import {
    Box, Button,
    Container,
    makeStyles
} from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import Results from './Results';
import {Role} from "../../../model/Employee";
import {useSnackbar} from "notistack";
import employeeService from "../../../services/EmployeeService";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const UserListView = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [roles, setRoles] = useState<[] | Role[]>([]);

    useEffect(() => {
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

        getRoles().then(null)
    }, [enqueueSnackbar])

    if (roles.length === 0) return null

    return (
        <Page className={classes.root} title="Сотрудники">
            <Container maxWidth={false}>
                <Header />
                    <Box mt={3}>
                        <Results roles={roles} />
                    </Box>
            </Container>
        </Page>
    );
}

export default UserListView;
