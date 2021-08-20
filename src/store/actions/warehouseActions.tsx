import {Warehouse} from "../../model/Warehouse";

export const SET_WAREHOUSE = '@warehouse/set-selected-warehouse';
export const DELETE_WAREHOUSE = '@warehouse/delete-selected-warehouse';
export const setSelectedWarehouse = (warehouse: Warehouse) => {
    return {
        type: SET_WAREHOUSE,
        payload: warehouse
    }
}
export const deleteSelectedWarehouse = () => {
    return {
        type: DELETE_WAREHOUSE,
        payload: null
    }
}
