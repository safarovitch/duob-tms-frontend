import axios from "../utils/Api";
import {Dispatch} from "redux";
import {User} from "../model/User";
import {API_BASE_URL} from "../config";
import {setUserData} from "../store/actions/accountActions";

class AuthService {
    setAxiosInterceptors = (onLogout: () => (dispatch: Dispatch) => Promise<void>) => {
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    this.setSession(null);

                    if (onLogout) {
                        onLogout();
                    }
                }

                return Promise.reject(error);
            }
        );
    };

    handleAuthentication() {
        const accessToken = this.getAccessToken();
        const user: User = JSON.parse(localStorage.getItem('user') as string);


        if (!accessToken || !user) {
            return;
        }
        setUserData(user)
        this.setSession(accessToken, user);
    }

    loginWithUsernameAndPassword = (username: string, password: string) => new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        axios.post(API_BASE_URL + '/authenticate', params)
            .then((response) => {
                if (response.data) {
                    this.setSession(response.data.jwt, response.data);
                    resolve(response.data);
                } else {
                    reject(response.data.error);
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    logout = () => {
        this.setSession(null);
    }

    setSession = (accessToken: string | null, userData?: User) => {
        if (accessToken && userData) {
            userData.jwt = null;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common.Authorization;
        }
    }

    updateUserParams = (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getAccessToken = () => localStorage.getItem('accessToken');
    isAuthenticated = () => !!this.getAccessToken()
}

const authService = new AuthService();

export default authService;
