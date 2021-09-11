import {Driver, Truck} from "../../model/Road";
import {SET_DRIVER, DELETE_DRIVER, SET_TRUCK, DELETE_TRUCK} from "../actions/roadActions";

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

export const roadTruckReducer = (state = null, action: {type: any, payload: Truck | any}) => {
    switch (action.type) {
        case SET_TRUCK: {
            return action.payload
        }
        case DELETE_TRUCK: {
            return action.payload
        }
        default: return state
    }
}
