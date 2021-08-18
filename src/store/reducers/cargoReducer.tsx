import {DELETE_CUSTOM_CODE, DELETE_PRODUCT, SET_CUSTOM_CODE, SET_PRODUCT} from "../actions/cargoActions";

export const productReducer = (state = null, action: { type: any; payload:  any; }) => {
    switch (action.type) {
        case SET_PRODUCT: {
            return action.payload;
        }
        case DELETE_PRODUCT: {
            return action.payload;
        }
        default: return state;

    }
}

export const customCodeReducer = (state = null, action: { type: any; payload:  any; }) => {
    switch (action.type) {
        case SET_CUSTOM_CODE: {
            return action.payload;
        }
        case DELETE_CUSTOM_CODE: {
            return action.payload;
        }
        default: return state;

    }
}
