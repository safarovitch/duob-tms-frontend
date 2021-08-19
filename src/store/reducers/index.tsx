import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import customerReducer from "./customerReducer";
import employeeReducer from './employeeReducer';
import providerReducer from "./providerReducer";
import warehouseReducer from "./warehouseReducer";

const rootReducer = combineReducers({
    user: accountReducer,
    selectedCustomer: customerReducer,
    employee: employeeReducer,
    selectedProvider: providerReducer,
    selectedWarehouse: warehouseReducer
});

export default rootReducer;
