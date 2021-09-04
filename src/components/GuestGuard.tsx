import React from "react";
import {useSelector} from "react-redux";
import {User} from "../model/User";
import {Redirect} from "react-router-dom";

const GuestGuard: React.FC = ({children}) => {
    const user = useSelector((state: { user: User }) => state.user);

    if (user !== null) return <Redirect to="/" />;

    return <>{children}</>;
}

export default GuestGuard;
