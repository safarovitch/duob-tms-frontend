import React from 'react';
// import {useSelector} from 'react-redux';
// import { Redirect } from 'react-router-dom';
// import {accountInitialState} from "../store/reducers/accountReducer";

const AuthGuard: React.FC = ({ children }) => {
    // const account = useSelector(({account}: {account: accountInitialState}) => account);

    // if (!account.user) {
    //     return <Redirect to="/login" />;
    // }

    return <>{children}</>;
}

export default AuthGuard;
