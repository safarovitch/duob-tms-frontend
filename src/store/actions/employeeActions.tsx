import {Employee} from "../../model/Employee";

export const SET_EMPLOYEE = '@employee/set-employee';
export const DELETE_EMPLOYEE = '@employee/delete-employee';

export const setSelectedEmployee = (employee: Employee) => {
    return {
        type: SET_EMPLOYEE,
        payload: employee
    }
}

export const deleteSelectedEmployee = () => {
    return {
        type: DELETE_EMPLOYEE,
        payload: null
    }
}
