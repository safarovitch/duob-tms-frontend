import React, {useEffect, useState} from 'react';
import {Box, Container, makeStyles} from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import Results from './Results';
import {Role} from "../../../model/Employee";
import {useSnackbar} from "notistack";
import employeeService from "../../../services/EmployeeService";
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

const EmployeeListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await employeeService.getRoles()

                if (!cancel) setRoles(data)
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar])

    return (
        <Page title="Сотрудники">
            {
                roles.length > 0 ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Header />
                        <Box mt={3}>
                            <Results roles={roles} />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default EmployeeListView;
