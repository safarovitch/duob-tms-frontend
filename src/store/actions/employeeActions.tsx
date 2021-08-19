import {Employee} from "../../model/Employee";

export const SET_SELECTED_EMPLOYEE = '@employee/set-selected-employee';
export const UNSET_SELECTED_EMPLOYEE = '@employee/unset-selected-employee';

export const setSelectedEmployee = (employee: Employee) => {
    return {
        type: SET_SELECTED_EMPLOYEE,
        payload: {
            employee
        }
    }
}

export const unsetSelectedEmployee = () => {
    return {
        type: UNSET_SELECTED_EMPLOYEE
    }
}
