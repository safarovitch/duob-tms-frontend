import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import customerReducer from "./customerReducer";
import {customCodeReducer, productReducer} from "./cargoReducer";

const rootReducer = combineReducers({
    user: accountReducer,
    selectedCustomer: customerReducer,
    selectedProduct: productReducer,
    selectedCustomCode: customCodeReducer
});

export default rootReducer;
