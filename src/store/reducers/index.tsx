import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import customerReducer from "./customerReducer";
import employeeReducer from './employeeReducer';
import providerReducer from "./providerReducer";
import warehouseReducer from "./warehouseReducer";
import {cargoTariffReducer, cargoTypeReducer, customCodeReducer, productReducer} from "./cargoReducer";
import {roadDriverReducer, roadTrailerReducer, roadTruckReducer, roadTruckTypeReducer} from "./roadReducer";

const rootReducer = combineReducers({
    user: accountReducer,
    selectedCustomer: customerReducer,
    selectedEmployee: employeeReducer,
    selectedProvider: providerReducer,
    selectedWarehouse: warehouseReducer,
    selectedProduct: productReducer,
    selectedCustomCode: customCodeReducer,
    selectedCargoType: cargoTypeReducer,
    selectedCargoTariff: cargoTariffReducer,
    selectedRoadDriver: roadDriverReducer,
    selectedRoadTruck: roadTruckReducer,
    selectedRoadTrailer: roadTrailerReducer,
    selectedRoadTruckType: roadTruckTypeReducer,
});

export default rootReducer;
