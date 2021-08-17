import {Customer} from "../../model/Customer";
import {DELETE_CUSTOMER, SET_CUSTOMER} from "../actions/customerActions";

const customerReducer = (state = null, action: { type: any; payload:  Customer | null; }) => {
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

export default customerReducer;
