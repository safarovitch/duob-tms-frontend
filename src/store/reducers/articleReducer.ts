import {Article} from "../../model/Article";
import {SET_ARTICLE_INCOME, DELETE_ARTICLE_INCOME, SET_ARTICLE_OUTCOME, DELETE_ARTICLE_OUTCOME} from "../actions/articleActions";

export const articleIncomeReducer = (state = null, action: {type: any, payload: Article | any}) => {
    switch (action.type) {
        case SET_ARTICLE_INCOME: {
            return action.payload
        }
        case DELETE_ARTICLE_INCOME: {
            return action.payload
        }
        default: return state
    }
}

export const articleOutcomeReducer = (state = null, action: {type: any, payload: Article | any}) => {
    switch (action.type) {
        case SET_ARTICLE_OUTCOME: {
            return action.payload
        }
        case DELETE_ARTICLE_OUTCOME: {
            return action.payload
        }
        default: return state
    }
}
