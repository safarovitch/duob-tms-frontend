import { combineReducers } from "redux";
import accountReducer from "./accountReducer";

const rootReducer = combineReducers({
    user: accountReducer
});

export default rootReducer;
