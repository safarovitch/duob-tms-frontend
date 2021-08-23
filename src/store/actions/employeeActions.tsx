import {Employee} from "../../model/Employee";

export const SET_SELECTED_EMPLOYEE = '@employee/set-selected-employee';
export const DELETE_SELECTED_EMPLOYEE = '@employee/delete-selected-employee';

export const setSelectedEmployee = (employee: Employee) => {
    return {
        type: SET_SELECTED_EMPLOYEE,
        payload: {
            employee
        }
    }
}

export const deleteSelectedEmployee = () => {
    return {
        type: DELETE_SELECTED_EMPLOYEE
    }
}
