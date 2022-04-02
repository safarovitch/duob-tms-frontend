import React from "react";
import {useSelector} from "react-redux";
import {User} from "../model/User";
import {Redirect} from "react-router-dom";
import hasPermission from "../hooks/hasPermisson";
import {CUSTOMER_GUARD, EMPLOYEE_GUARD} from "../constants/permissions/roles";

const RedirectGuard: React.FC = ({children}) => {
    const user = useSelector((state: { user: User }) => state.user);
    const isEmployee = hasPermission(EMPLOYEE_GUARD);
    const isCustomer = hasPermission(CUSTOMER_GUARD);

    if (user === null) return <Redirect to="/login" />;

    if (isEmployee) return <Redirect to="/app" />;

    if (isCustomer) return <Redirect to="/customer" />;

    return <>{children}</>
}

export default RedirectGuard;
