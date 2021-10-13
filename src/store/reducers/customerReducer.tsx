import {Customer, CustomerCargo} from "../../model/Customer";
import {DELETE_CUSTOMER, DELETE_CUSTOMER_CARGO, SET_CUSTOMER, SET_CUSTOMER_CARGO} from "../actions/customerActions";

export const customerReducer = (state = null, action: { type: any; payload:  Customer | null; }) => {
    switch (action.type) {
        case SET_CUSTOMER: {
            return action.payload;
        }
        case DELETE_CUSTOMER: {
            return action.payload;
        }
        default: return state;
    }
}

export const customerCargoReducer = (state = null, action: { type: any; payload:  CustomerCargo | null; }) => {
    switch (action.type) {
        case SET_CUSTOMER_CARGO: {
            return action.payload;
        }
        case DELETE_CUSTOMER_CARGO: {
            return action.payload;
        }
        default: return state;
    }
}
