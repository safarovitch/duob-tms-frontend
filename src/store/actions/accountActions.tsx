import axios from '../../utils/Api';
import authService from '../../services/AuthService';
import {Dispatch} from "redux";
import {User} from "../../model/User";
import {API_BASE_URL} from "../../config";

export const LOGIN_REQUEST = '@account/login-request';
export const LOGIN_SUCCESS = '@account/login-success';
export const LOGIN_FAILURE = '@account/login-failure';
export const SILENT_LOGIN = '@account/silent-login';
export const LOGOUT = '@account/logout';
export const REGISTER = '@account/register';
export const UPDATE_PROFILE = '@account/update-profile';

export function login(username: string, password: string) {
    return async (dispatch: Dispatch) => {
        try {
            dispatch({ type: LOGIN_REQUEST });

            const user = await authService.loginWithUsernameAndPassword(username, password);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: user
            });
        } catch (error) {
            dispatch({ type: LOGIN_FAILURE, payload: error });
            throw error;
        }
    };
}

export function setUserData(user: User | null) {
    return (dispatch: Dispatch) => dispatch({
        type: SILENT_LOGIN,
        payload: user

    });
}

export function logout() {
    return async (dispatch: Dispatch) => {
        authService.logout();

        dispatch({
            type: LOGOUT
        });
    };
}

export function updateProfile(update: User) {
    const request = axios.post(API_BASE_URL + '/account/profile', { update });

    return (dispatch: Dispatch) => {
        request.then((response) => dispatch({
            type: UPDATE_PROFILE,
            payload: response.data
        }));
    };
}
