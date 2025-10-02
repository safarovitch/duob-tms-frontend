import React from 'react';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {User} from "../model/User";

const AuthGuard: React.FC = ({children}) => {
    const user = useSelector((state: { user: User }) => state.user);

    if (user === null) return <Redirect to="/login" />;

    return <>{children}</>;
}

export default AuthGuard;
