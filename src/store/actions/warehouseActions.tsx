import {Warehouse, WarehouseBalance} from "../../model/Warehouse";

export const SET_WAREHOUSE = '@warehouse/set-selected-warehouse';
export const DELETE_WAREHOUSE = '@warehouse/delete-selected-warehouse';
export const SET_WAREHOUSE_BALANCE = '@warehouse/set-warehouse-balance';
export const NEED_UPDATE_WAREHOUSE_BALANCE = '@warehouse/need-update-warehouse-balance';

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

export const setWarehouseBalance = (warehouseBalance: WarehouseBalance) => {
    return {
        type: SET_WAREHOUSE_BALANCE,
        payload: warehouseBalance
    }
}

export const needUpdateWarehouseBalance = () => {
    return {
        type: NEED_UPDATE_WAREHOUSE_BALANCE,
    }
}