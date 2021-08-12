import React from 'react';
import {useSelector} from 'react-redux';
import {Redirect, useLocation} from 'react-router-dom';
import {User} from "../model/User";

const AuthGuard: React.FC = ({children}) => {
    const user = useSelector((state: { user: User }) => state.user);
    const location = useLocation();
    if (location.pathname !== "/login" && !user) {
        return <Redirect to="/login" />;
    }
    if (location.pathname === "/login" && user) {
        return <Redirect to="/app"/>;
    }

    return <>{children}</>;
}

export default AuthGuard;
