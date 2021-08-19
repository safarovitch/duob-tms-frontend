import {Warehouse} from "../../model/Warehouse";
import {SET_WAREHOUSE, DELETE_WAREHOUSE} from "../actions/warehouseActions";

const warehouseReducer = (state = null, action: { type: any; payload:  Warehouse | null; }) => {
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

export default warehouseReducer;
