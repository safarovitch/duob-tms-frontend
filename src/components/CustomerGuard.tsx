import React from 'react';
import {Redirect} from 'react-router-dom';
import usePermission from "../hooks/usePermission";
import {CUSTOMER_GUARD} from "../constants/permissions/roles";

const CustomerGuard: React.FC = ({children}) => {
    if (!usePermission(CUSTOMER_GUARD)) return <Redirect to="/app"/>;

    return <>{children}</>;
}

export default CustomerGuard;
