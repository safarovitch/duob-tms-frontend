import React from 'react';
import {Redirect} from 'react-router-dom';
import usePermission from "../hooks/usePermission";
import {CUSTOMER_GUARD} from "../constants/permissions/roles";
import customerService from "../services/CustomerService";
import errorMessageHandler from "../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import {User} from "../model/User";
import authService from "../services/AuthService";

const CustomerGuard: React.FC = ({children}) => {
    const {enqueueSnackbar} = useSnackbar()
    const user = useSelector(({user}: { user: User }) => user);

    if (!usePermission(CUSTOMER_GUARD)) return <Redirect to="/" />;

    (async () => {
        try {
            const balance: any = await customerService.getBalance()

            user.balance = balance

            authService.updateUserParams(user)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    })()

    return <>{children}</>;
}

export default CustomerGuard;
