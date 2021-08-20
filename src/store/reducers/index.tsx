import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import customerReducer from "./customerReducer";
import {cargoTariffReducer, cargoTypeReducer, customCodeReducer, productReducer} from "./cargoReducer";

const rootReducer = combineReducers({
    user: accountReducer,
    selectedCustomer: customerReducer,
    selectedProduct: productReducer,
    selectedCustomCode: customCodeReducer,
    selectedCargoType: cargoTypeReducer,
    selectedCargoTariff: cargoTariffReducer,
});

export default rootReducer;
