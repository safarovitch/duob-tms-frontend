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

    getCustomers = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/clients/all`)
            .then((response) => {resolve(response.data)})
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
        api.get(`${API_BASE_URL}/clients/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteCustomer = (id: string) => new Promise((resolve, reject)  => {
        api.delete(API_BASE_URL + `/clients/${id}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    updatePassword = (params: {oldPassword: string, newPassword: string}) => new Promise((resolve, reject) => {
        api
            .put(`${API_BASE_URL}/clients/change-password`, params)
            .then(response => {
                resolve(response.data)
            }).catch(error => {reject(error)})
    })

    uploadAvatar = (file: File) => new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append("file", file);
        api
            .put(`${API_BASE_URL}/clients/avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(response => {
                resolve(response)
            }).catch(error => {reject(error)})
    })

    deleteAvatar = (name: string) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/clients/avatar/${name}`)
            .then(response => {
                if (response.status === 200) resolve(response.data)
                else reject(response.data.error)
            }).catch(error => {reject(error)})
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
