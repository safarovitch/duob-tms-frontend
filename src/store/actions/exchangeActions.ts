import {Exchange} from "../../model/Exchange";

export const SET_SELECTED_EXCHANGE = "@exchange/set-selected-exchange"
export const DELETE_SELECTED_EXCHANGE = "@exchange/delete-selected-exchange"

export const setSelectedExchange = (exchange: Exchange) => {
    return {
        type: SET_SELECTED_EXCHANGE,
        payload: exchange
    }
}

export const deleteSelectedExchange = () => {
    return {
        type: DELETE_SELECTED_EXCHANGE,
        payload: null
    }
}
