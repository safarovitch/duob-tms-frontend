import {
    IncomeByArticleApplication,
    OutcomeByArticleApplication, OutcomeTransferWarehouseApplication,
    RefillBalanceApplication
} from "../../model/Application";
import {
    SET_REFILL_BALANCE,
    DELETE_REFILL_BALANCE,
    SET_INCOME_ARTICLE,
    DELETE_INCOME_ARTICLE,
    SET_OUTCOME_ARTICLE,
    DELETE_OUTCOME_ARTICLE,
    SET_OUTCOME_TRANSFER_WAREHOUSE,
    DELETE_OUTCOME_TRANSFER_WAREHOUSE
} from "../actions/applicationAction";

export const refillBalanceReducer = (state = null, action: {type: any, payload: RefillBalanceApplication | any}) => {
    switch (action.type) {
        case SET_REFILL_BALANCE: {
            return action.payload
        }
        case DELETE_REFILL_BALANCE: {
            return action.payload
        }
        default: return state
    }
}

export const applicationIncomeArticleReducer = (state = null, action: {type: any, payload: IncomeByArticleApplication | any}) => {
    switch (action.type) {
        case SET_INCOME_ARTICLE: {
            return action.payload
        }
        case DELETE_INCOME_ARTICLE: {
            return action.payload
        }
        default: return state
    }
}

export const applicationOutcomeArticleReducer = (state = null, action: {type: any, payload: OutcomeByArticleApplication | any}) => {
    switch (action.type) {
        case SET_OUTCOME_ARTICLE: {
            return action.payload
        }
        case DELETE_OUTCOME_ARTICLE: {
            return action.payload
        }
        default: return state
    }
}

export const applicationOutcomeTransferWarehouseReducer = (state = null, action: {type: any, payload: OutcomeTransferWarehouseApplication | any}) => {
    switch (action.type) {
        case SET_OUTCOME_TRANSFER_WAREHOUSE: {
            return action.payload
        }
        case DELETE_OUTCOME_TRANSFER_WAREHOUSE: {
            return action.payload
        }
        default: return state
    }
}
