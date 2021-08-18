import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import customerReducer from "./customerReducer";
import employeeReducer from './employeeReducer';

const rootReducer = combineReducers({
    user: accountReducer,
    selectedCustomer: customerReducer,
    employee: employeeReducer
});

export default rootReducer;
