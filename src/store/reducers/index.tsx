import {combineReducers} from "redux";
import accountReducer from "./accountReducer";
import {customerReducer, customerCargoReducer} from "./customerReducer";
import employeeReducer from './employeeReducer';
import providerReducer from "./providerReducer";
import warehouseReducer from "./warehouseReducer";
import {cargoTariffReducer, cargoTypeReducer, customCodeReducer, productReducer} from "./cargoReducer";
import {
    roadDriverReducer,
    roadFuelDetailReducer,
    roadTrailerReducer,
    roadTruckReducer,
    roadTruckTypeReducer
} from "./roadReducer";
import {articleIncomeReducer, articleOutcomeReducer} from "./articleReducer";
import {
    applicationIncomeArticleReducer,
    applicationOutcomeArticleReducer,
    applicationOutcomeTransferWarehouseReducer,
    refillBalanceReducer
} from "./applicationReducer";

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
    selectedRoadFuelDetail: roadFuelDetailReducer,
    selectedArticleIncome: articleIncomeReducer,
    selectedArticleOutcome: articleOutcomeReducer,
    selectedRefillBalance: refillBalanceReducer,
    selectedApplicationIncomeArticle: applicationIncomeArticleReducer,
    selectedApplicationOutcomeArticle: applicationOutcomeArticleReducer,
    selectedApplicationOutcomeTransferWarehouse: applicationOutcomeTransferWarehouseReducer,
    selectedCustomerCargo: customerCargoReducer,
});

export default rootReducer;
