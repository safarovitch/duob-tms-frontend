import {SET_EMPLOYEE, DELETE_EMPLOYEE} from "../actions/employeeActions";
import {Employee} from "../../model/Employee";

const employeeReducer = (state = null, action: {type: any, payload: Employee | null}) => {
    switch (action.type) {
        case SET_EMPLOYEE: {
            return action.payload
        }
        case DELETE_EMPLOYEE: {
            return action.payload;
        }

        default: return state
    }
}

export default employeeReducer
