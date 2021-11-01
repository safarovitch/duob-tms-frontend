import {Warehouse, WarehouseBalance} from "../../model/Warehouse";
import {
    SET_WAREHOUSE,
    DELETE_WAREHOUSE,
    SET_WAREHOUSE_BALANCE, NEED_UPDATE_WAREHOUSE_BALANCE
} from "../actions/warehouseActions";

export const warehouseReducer = (state = null, action: { type: any; payload:  Warehouse | null; }) => {
    switch (action.type) {
        case SET_WAREHOUSE: {
            return action.payload;
        }
        case DELETE_WAREHOUSE: {
            return action.payload;
        }
        default: return state;
    }
}

export const warehouseBalanceReducer = (state = null, action: { type: any; payload:  WarehouseBalance | null; }) => {
    switch (action.type) {
        case SET_WAREHOUSE_BALANCE: {
            return action.payload;
        }
        default: return state;
    }
}

export const warehouseNeedUpdateBalanceReducer = (state = 0, action: { type: any; }) => {
    switch (action.type) {
        case NEED_UPDATE_WAREHOUSE_BALANCE: {
            return ++state;
        }
        default: return state;
    }
}