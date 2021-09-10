import React, {useEffect, useState} from 'react';
import {CircularProgress, Grid, makeStyles} from '@material-ui/core';
import ProfileDetails from './ProfileDetails';
import GeneralSettings from './GeneralSettings';
import {Customer} from "../../../../../model/Customer";
import customerService from "../../../../../services/CustomerService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../../../utils/errorMessageHandler";
import {useSelector} from "react-redux";
import {User} from "../../../../../model/User";

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
    const [customer, setCustomer] = useState<Customer>()
    const [loading, setLoading] = useState(false)
    const user = useSelector((state: {user: User}) => state.user);

    useEffect(() => {
        (async function() {
            try {
                setLoading(true)
                const customer: any = await customerService.getCustomer(user.userId.toString());
                setCustomer(customer);
            } catch (error) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'});
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <Grid
            className={classes.root}
            container
            spacing={3}
        >
            {loading && (<CircularProgress size={48} className={classes.tableProgress}/>)}
            {customer && (
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
                        <GeneralSettings customer={customer} />
                    </Grid>
                </>
            )}
        </Grid>
    );
}

export default General;
