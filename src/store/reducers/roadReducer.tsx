import {Driver, RoadFuelDetail, Trailer, Truck, TruckType} from "../../model/Road";
import {
    SET_DRIVER, DELETE_DRIVER, SET_TRUCK, DELETE_TRUCK, SET_TRAILER, DELETE_TRAILER, SET_TRUCK_TYPE,
    DELETE_TRUCK_TYPE, SET_ROAD_FUEL_DETAIL, DELETE_ROAD_FUEL_DETAIL
} from "../actions/roadActions";

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

export const roadTrailerReducer = (state = null, action: {type: any, payload: Trailer | any}) => {
    switch (action.type) {
        case SET_TRAILER: {
            return action.payload
        }
        case DELETE_TRAILER: {
            return action.payload
        }
        default: return state
    }
}

export const roadTruckTypeReducer = (state = null, action: {type: any, payload: TruckType | any}) => {
    switch (action.type) {
        case SET_TRUCK_TYPE: {
            return action.payload
        }
        case DELETE_TRUCK_TYPE: {
            return action.payload
        }
        default: return state
    }
}

export const roadFuelDetailReducer = (state = null, action: {type: any, payload: RoadFuelDetail | any}) => {
    switch (action.type) {
        case SET_ROAD_FUEL_DETAIL: {
            return action.payload
        }
        case DELETE_ROAD_FUEL_DETAIL: {
            return action.payload
        }
        default: return state
    }
}
