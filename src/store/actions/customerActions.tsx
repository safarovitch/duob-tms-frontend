import {Customer} from "../../model/Customer";

export const SET_CUSTOMER = '@customer/set-selected-customer';
export const DELETE_CUSTOMER = '@customer/delete-selected-customer';
export const setSelectedCustomer = (customer: Customer) => {
    return {
        type: SET_CUSTOMER,
        payload: customer
    }
}
export const deleteSelectedCustomer = () => {
    return {
        type: DELETE_CUSTOMER,
        payload: null
    }
}
