import React, {useEffect, useState} from 'react';
import {CircularProgress, Grid, makeStyles} from '@material-ui/core';
import ProfileDetails from './ProfileDetails';
import GeneralSettings from './GeneralSettings';
import {Employee} from "../../../model/Employee";
import employeeService from "../../../services/EmployeeService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const useStyles = makeStyles(() => ({
    root: {},
    tableProgress: {
        color: "secondary",
        position: 'absolute',
        top: '50%',
        left: '50%',
    }
}));

const General: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [employee, setEmployee] = useState<Employee>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async function() {
            try {
                setLoading(true)
                const employee: any = await employeeService.getEmployee();
                setEmployee(employee);
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'});
            } finally {
                setLoading(false)
            }
        })()
    }, [enqueueSnackbar])

    return (
        <Grid
            className={classes.root}
            container
            spacing={3}
        >
            {loading && (<CircularProgress size={48} className={classes.tableProgress}/>)}
            {employee && (
                <>
                    <Grid item
                          lg={4}
                          md={6}
                          xl={3}
                          xs={12}
                    >
                        <ProfileDetails />
                    </Grid>
                    <Grid item
                    lg={8}
                    md={6}
                    xl={9}
                    xs={12}
                    >
                        <GeneralSettings employee={employee} />
                    </Grid>
                </>
            )}
        </Grid>
    );
}

export default General;
