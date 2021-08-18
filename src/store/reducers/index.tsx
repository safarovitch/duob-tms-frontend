import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import employeeReducer from './employeeReducer';

const rootReducer = combineReducers({
    account: accountReducer,
    employee: employeeReducer
});

export default rootReducer;
