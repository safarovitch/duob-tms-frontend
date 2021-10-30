import {Employee, Accountability} from "../../model/Employee";

export const SET_EMPLOYEE = '@employee/set-employee';
export const DELETE_EMPLOYEE = '@employee/delete-employee';
export const SET_EMPLOYEE_ACCOUNTABILITY = '@employee/set-employee-accountability';
export const DELETE_EMPLOYEE_ACCOUNTABILITY = '@employee/delete-employee-accountability';

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

export const setSelectedEmployeeAccountability = (employeeAccountability: Accountability) => {
    return {
        type: SET_EMPLOYEE_ACCOUNTABILITY,
        payload: employeeAccountability
    }
}

export const deleteSelectedEmployeeAccountability = () => {
    return {
        type: DELETE_EMPLOYEE_ACCOUNTABILITY,
        payload: null
    }
}