import React from 'react';
import {RootStateOrAny, useSelector} from 'react-redux';
import { Redirect } from 'react-router-dom';

const AuthGuard: React.FC = ({ children }) => {
    const account = useSelector((state: RootStateOrAny) => state.account);

    // if (!account.user) {
    //     return <Redirect to="/login" />;
    // }

    return <>{children}</>;
}

export default AuthGuard;
