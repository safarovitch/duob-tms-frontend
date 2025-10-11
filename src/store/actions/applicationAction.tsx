import {
    IncomeByArticleApplication,
    OutcomeByArticleApplication, OutcomeTransferWarehouseApplication,
    RefillBalanceApplication, RoadDriverApplicationResponse
} from "../../model/Application";

export const SET_REFILL_BALANCE = '@application/set-selected-refill-balance';
export const DELETE_REFILL_BALANCE = '@application/delete-selected-refill-balance';
export const SET_INCOME_ARTICLE = '@application/set-selected-income-article';
export const DELETE_INCOME_ARTICLE = '@application/delete-selected-income-article';
export const SET_OUTCOME_ARTICLE = '@application/set-selected-outcome-article';
export const DELETE_OUTCOME_ARTICLE = '@application/delete-selected-outcome-article';
export const SET_OUTCOME_TRANSFER_WAREHOUSE = '@application/set-selected-outcome-transfer-warehouse';
export const DELETE_OUTCOME_TRANSFER_WAREHOUSE = '@application/delete-selected-outcome-transfer-warehouse';
export const SET_ROAD_DRIVER = '@application/set-selected-road-driver';
export const DELETE_ROAD_DRIVER = '@application/delete-selected-road-driver';

export const setSelectedRefillBalance = (refillBalance: RefillBalanceApplication) => {
    return {
        type: SET_REFILL_BALANCE,
        payload: refillBalance
    }
}

export const deleteSelectedRefillBalance = () => {
    return {
        type: DELETE_REFILL_BALANCE,
        payload: null
    }
}

export const setSelectedIncomeArticle = (incomeArticle: IncomeByArticleApplication) => {
    return {
        type: SET_INCOME_ARTICLE,
        payload: incomeArticle
    }
}

export const deleteSelectedIncomeArticle = () => {
    return {
        type: DELETE_INCOME_ARTICLE,
        payload: null
    }
}

export const setSelectedOutcomeArticle = (outcomeArticle: OutcomeByArticleApplication) => {
    return {
        type: SET_OUTCOME_ARTICLE,
        payload: outcomeArticle
    }
}

export const deleteSelectedOutcomeArticle = () => {
    return {
        type: DELETE_OUTCOME_ARTICLE,
        payload: null
    }
}

export const setSelectedOutcomeTransferWarehouse = (outcomeTransferWarehouse: OutcomeTransferWarehouseApplication) => {
    return {
        type: SET_OUTCOME_TRANSFER_WAREHOUSE,
        payload: outcomeTransferWarehouse
    }
}

export const deleteSelectedOutcomeTransferWarehouse = () => {
    return {
        type: DELETE_OUTCOME_TRANSFER_WAREHOUSE,
        payload: null
    }
}

export const setSelectedRoadDriver = (roadDriver: RoadDriverApplicationResponse) => {
    return {
        type: SET_ROAD_DRIVER,
        payload: roadDriver
    }
}

export const deleteSelectedRoadDriver = () => {
    return {
        type: DELETE_ROAD_DRIVER,
        payload: null
    }
}
