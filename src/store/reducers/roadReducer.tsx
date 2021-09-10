import {Driver} from "../../model/Road";
import {DELETE_DRIVER, SET_DRIVER} from "../actions/roadActions";

export const roadDriverReducer = (state = null, action: {type: any, payload: Driver | any}) => {
    switch (action.type) {
        case SET_DRIVER: {
            return action.payload
        }
        case DELETE_DRIVER: {
            return action.payload
        }
        default: return state
    }
}
