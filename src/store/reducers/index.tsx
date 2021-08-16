import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import customerReducer from "./customerReducer";

const rootReducer = combineReducers({
    user: accountReducer,
    selectedCustomer: customerReducer
});

export default rootReducer;
