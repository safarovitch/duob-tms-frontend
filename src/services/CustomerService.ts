import api from '../utils/Api'
import {Customer} from "../model/Customer";
import {API_BASE_URL} from "../config";

class CustomerService {
    postNewCustomer = (customer: Customer) => new Promise((resolve, reject)  => {
        api.post(API_BASE_URL + '/clients', customer)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    updateCustomer = (customer: Customer) => new Promise((resolve, reject)  => {
        api.put(API_BASE_URL + '/clients/', customer)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    getFilteredCustomers = (page: number, size: number, query: string) => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/clients?page=${page}&size=${size}&search=${query}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    getCustomer = (id: string) => new Promise((resolve, reject) => {
        resolve({
            "id": 58,
            "createdDate": null,
            "updatedDate": "01.09.2021 10:25",
            "name": "Фарход",
            "username": "aziz",
            "code": "Ф-2020",
            "password": null,
            "phoneNumber": "231312312312",
            "birthdate": null,
            "address": "Вяземский Переулок, 5-7",
            "balance": 0,
            "amount": 0,
            "placeNumber": 0
        });
        // api.get(`${API_BASE_URL}/clients/${id}`)
        //     .then(response => resolve(response.data))
        //     .catch(error => reject(error))
    })

    deleteCustomer = (id: string) => new Promise((resolve, reject)  => {
        api.delete(API_BASE_URL + `/clients/${id}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    getActiveCargos = (id: string, page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/active-cargo?clientId=${id}&page=${page}&size=${size}`)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })

    getReceivedCargos = (id: string, page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/received-cargo?clientId=${id}&page=${page}&size=${size}`)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })

    getReconciliationActs = (id: string, page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/payment-history?clientId=${id}&page=${page}&size=${size}`)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })
}

const customerService = new CustomerService();
export default customerService;
