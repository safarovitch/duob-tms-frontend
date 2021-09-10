import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    SILENT_LOGIN,
    UPDATE_PROFILE
} from '../actions/accountActions';
import {User} from "../../model/User";

const accountReducer = (state = null, action: { type: any; payload: User; }) => {
    switch (action.type) {
        case LOGIN_REQUEST: {
            return null;
        }

        case LOGIN_SUCCESS: {
            return action.payload;
        }

        case LOGIN_FAILURE: {
            return null;
        }

        case LOGOUT: {
            return null;
        }

        case SILENT_LOGIN: {
            return action.payload
        }

        case UPDATE_PROFILE: {
            return action.payload;
        }

        default: {
            return state;
        }
    }
};

export default accountReducer;
