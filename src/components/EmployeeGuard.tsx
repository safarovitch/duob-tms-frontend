import React from 'react';
import {Redirect} from 'react-router-dom';
import hasPermission from "../hooks/hasPermisson";
import {EMPLOYEE_GUARD} from "../constants/permissions/roles";

const EmployeeGuard: React.FC<{children: React.ReactNode}> = ({children}) => {

    if (!hasPermission(EMPLOYEE_GUARD)) return <Redirect to="/" />;

    return <>{children}</>;
}

export default EmployeeGuard;
