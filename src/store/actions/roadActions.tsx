import {Driver, Trailer, Truck} from "../../model/Road";
export const SET_DRIVER = '@road/set-selected-driver';
export const DELETE_DRIVER = '@road/delete-selected-driver';
export const SET_TRUCK = '@road/set-selected-truck';
export const DELETE_TRUCK = '@road/delete-selected-truck';
export const SET_TRAILER = '@road/set-selected-trailer';
export const DELETE_TRAILER = '@road/delete-selected-trailer';

export const setSelectedDriver = (driver: Driver) => {
    return {
        type: SET_DRIVER,
        payload: driver
    }
}

export const deleteSelectedDriver = () => {
    return {
        type: DELETE_DRIVER,
        payload: null
    }
}

export const setSelectedTruck = (truck: Truck) => {
    return {
        type: SET_TRUCK,
        payload: truck
    }
}

export const deleteSelectedTruck = () => {
    return {
        type: DELETE_TRUCK,
        payload: null
    }
}

export const setSelectedTrailer = (trailer: Trailer) => {
    return {
        type: SET_TRAILER,
        payload: trailer
    }
}

export const deleteSelectedTrailer = () => {
    return {
        type: DELETE_TRAILER,
        payload: null
    }
}
