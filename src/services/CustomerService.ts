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

    deleteCustomer = (id: string) => new Promise((resolve, reject)  => {
        api.delete(API_BASE_URL + `/clients/${id}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })
}

const customerService = new CustomerService();
export default customerService;
