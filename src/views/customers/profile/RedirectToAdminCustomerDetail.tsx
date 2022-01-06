import React from "react";
import {useParams} from "react-router";
import {Redirect} from "react-router-dom";

const RedirectToAdminCustomerDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();

    return <Redirect to={`/app/customers/${id}/cargos`} />
}

export default RedirectToAdminCustomerDetail;
