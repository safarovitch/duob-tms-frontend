import {Exchange} from "../../model/Exchange";
import {DELETE_SELECTED_EXCHANGE, SET_SELECTED_EXCHANGE} from "../actions/exchangeActions";

export const exchangeReducer = (state = null, action: {type: any, payload: Exchange | null}) => {
    switch (action.type) {
        case SET_SELECTED_EXCHANGE: {
            return action.payload
        }
        case DELETE_SELECTED_EXCHANGE: {
            return action.payload
        }
        default: return state
    }
}

export default exchangeReducer
