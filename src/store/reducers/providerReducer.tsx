import {Provider} from "../../model/Provider";
import {DELETE_PROVIDER, SET_PROVIDER} from "../actions/providerActions";

const providerReducer = (state = null, action: { type: any; payload:  Provider | null; }) => {
    switch (action.type) {
        case SET_PROVIDER: {
            return action.payload;
        }
        case DELETE_PROVIDER: {
            return action.payload;
        }
        default: return state;

    }
}

export default providerReducer;
