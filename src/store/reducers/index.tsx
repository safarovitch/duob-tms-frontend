import {combineReducers} from "redux";
import accountReducer from "./accountReducer";
import {customerReducer, customerCargoReducer} from "./customerReducer";
import {employeeReducer, employeeAccountabilityReducer} from './employeeReducer';
import providerReducer from "./providerReducer";
import {warehouseReducer, warehouseBalanceReducer, warehouseNeedUpdateBalanceReducer} from "./warehouseReducer";
import {cargoTariffReducer, cargoTypeReducer, customCodeReducer, productReducer} from "./cargoReducer";
import {roadDriverReducer, roadFuelDetailReducer, roadTrailerReducer, roadTruckReducer,
    roadTruckTypeReducer} from "./roadReducer";
import {articleIncomeReducer, articleOutcomeReducer} from "./articleReducer";
import {applicationIncomeArticleReducer, applicationOutcomeArticleReducer, applicationOutcomeTransferWarehouseReducer,
    applicationRoadDriverReducer, refillBalanceReducer} from "./applicationReducer";
import exchangeReducer from "./exchangeReducer";

const rootReducer = combineReducers({
    user: accountReducer,
    selectedCustomer: customerReducer,
    selectedEmployee: employeeReducer,
    selectedEmployeeAccountability: employeeAccountabilityReducer,
    selectedProvider: providerReducer,
    selectedWarehouse: warehouseReducer,
    warehouseBalance: warehouseBalanceReducer,
    needUpdateWarehouseBalance: warehouseNeedUpdateBalanceReducer,
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
    selectedApplicationRoadDriver: applicationRoadDriverReducer,
    selectedCustomerCargo: customerCargoReducer,
    selectedExchange: exchangeReducer
});

export default rootReducer;
