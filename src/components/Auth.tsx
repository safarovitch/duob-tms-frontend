import React, {
    useEffect,
    useState
} from 'react';
import { useDispatch } from 'react-redux';
import { setUserData, logout } from '../store/actions/accountActions';
import authService from '../services/AuthService';
import LoadingScreen from "./LoadingScreen";

const Auth: React.FC<{children: any}> = ({ children }) => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            authService.setAxiosInterceptors(() => dispatch(logout()));

            authService.handleAuthentication();

            if (authService.isAuthenticated()) {
                const user = JSON.parse(localStorage.getItem('user') as string);
                await dispatch(setUserData(user));
            }

            setLoading(false);
        };

        initAuth();
    }, [dispatch]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return children;
}

export default Auth;
