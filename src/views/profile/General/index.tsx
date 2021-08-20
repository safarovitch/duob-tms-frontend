import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import ProfileDetails from './ProfileDetails';
import GeneralSettings from './GeneralSettings';
import {Employee} from "../../../model/Employee";

const useStyles = makeStyles(() => ({
    root: {}
}));

const General: React.FC<{employee: Employee, getEmployee: Function}> = ({employee, getEmployee}) => {
    const classes = useStyles();

    return (
        <Grid
            className={classes.root}
            container
            spacing={3}
        >
            <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
            >
                <ProfileDetails employee={employee} getEmployee={getEmployee} />
            </Grid>
            <Grid
                item
                lg={8}
                md={6}
                xl={9}
                xs={12}
            >
                <GeneralSettings employee={employee} getEmployee={getEmployee} />
            </Grid>
        </Grid>
    );
}

export default General;
