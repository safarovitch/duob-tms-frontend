import {AnyAction} from "redux";
import {SET_SELECTED_EMPLOYEE, UNSET_SELECTED_EMPLOYEE} from "../actions/employeeActions";
import {Employee} from "../../model/Employee";

export type employeeInitialState = {
    selectedEmployee: null| Employee;
}

const initialState: employeeInitialState = {
    selectedEmployee: null
};

const employeeReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case SET_SELECTED_EMPLOYEE: {
            return {
                ...state,
                selectedEmployee: action.payload.employee
            }
        }
        case UNSET_SELECTED_EMPLOYEE: {
            return {
                ...state,
                selectedEmployee: null
            }
        }
    }

    return state
}

export default employeeReducer
