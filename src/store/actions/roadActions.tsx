import {Driver} from "../../model/Road";
export const SET_DRIVER = '@road/set-selected-driver';
export const DELETE_DRIVER = '@road/delete-selected-driver';

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
