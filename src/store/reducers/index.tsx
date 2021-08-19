import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import customerReducer from "./customerReducer";
import employeeReducer from './employeeReducer';
import providerReducer from "./providerReducer";

const rootReducer = combineReducers({
    user: accountReducer,
    selectedCustomer: customerReducer,
    employee: employeeReducer,
    selectedProvider: providerReducer
});

export default rootReducer;
