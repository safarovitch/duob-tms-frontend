import React from "react";
import {useParams} from "react-router";
import {Redirect} from "react-router-dom";
import {CASHIER} from "../../../constants/permissions/roles";
import hasPermission from "../../../hooks/hasPermisson";

const RedirectToAdminCustomerDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const hasCashier = hasPermission([CASHIER])

    return <Redirect to={`/app/customers/${id}/${hasCashier ? 'credits' : 'cargos'}`} />
}

export default RedirectToAdminCustomerDetail;
