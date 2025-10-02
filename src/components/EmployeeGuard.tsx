import React from 'react';
import {Redirect} from 'react-router-dom';
import usePermission from "../hooks/usePermission";
import {EMPLOYEE_GUARD} from "../constants/permissions/roles";

const EmployeeGuard: React.FC<{children: React.ReactNode}> = ({children}) => {

    if (!usePermission(EMPLOYEE_GUARD)) return <Redirect to="/" />;

    return <>{children}</>;
}

export default EmployeeGuard;
