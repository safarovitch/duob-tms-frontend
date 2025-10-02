import {
    SET_EMPLOYEE,
    DELETE_EMPLOYEE,
    SET_EMPLOYEE_ACCOUNTABILITY,
    DELETE_EMPLOYEE_ACCOUNTABILITY,
} from "../actions/employeeActions";
import {Employee, Accountability} from "../../model/Employee";

export const employeeReducer = (state = null, action: {type: any, payload: Employee | any}) => {
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

export const employeeAccountabilityReducer = (state = null, action: {type: any, payload: Accountability | any}) => {
    switch (action.type) {
        case SET_EMPLOYEE_ACCOUNTABILITY: {
            return action.payload
        }
        case DELETE_EMPLOYEE_ACCOUNTABILITY: {
            return action.payload;
        }
        default: return state
    }
}
