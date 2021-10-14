import {Customer, CustomerCargo} from "../../model/Customer";

export const SET_CUSTOMER = '@customer/set-selected-customer';
export const DELETE_CUSTOMER = '@customer/delete-selected-customer';
export const SET_CUSTOMER_CARGO = '@customer/set-selected-customer-cargo';
export const DELETE_CUSTOMER_CARGO = '@customer/delete-selected-customer-cargo';

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

export const setSelectedCustomerCargo = (customerCargo: CustomerCargo) => {
    return {
        type: SET_CUSTOMER_CARGO,
        payload: customerCargo
    }
}
export const deleteSelectedCustomerCargo = () => {
    return {
        type: DELETE_CUSTOMER_CARGO,
        payload: null
    }
}
