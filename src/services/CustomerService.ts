import api from '../utils/Api'
import {CreditPaidRequest, Customer} from "../model/Customer";
import {API_BASE_URL} from "../config";

class CustomerService {
    getBalance = () => new Promise((resolve, reject) => {
        api.get(API_BASE_URL + '/clients/balance')
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

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

    getActiveCargos = (id: string, page: number, size: number, status: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/clients/income-cargos${id ? `/${id}` : ``}?page=${page}&size=${size}&${encodeURI(`extraParams[cargoStatus]=${status}`)}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getReconciliationActs = (id: string, page: number, size: number, startDate: string, endDate: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/clients/reconciliation${id ? `/${id}` : ``}`, {params: {page, size, startDate, endDate}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getCredits = (id: string, page: number, size: number) =>
        new Promise((resolve, reject) => {
            api.get(`${API_BASE_URL}/client-credits${id ? `/${id}` : ``}`,
                {params: {page, size}})
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        })

    approveAdminApplication = (id: number) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/client-credits/${id}/admin-approval`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    approveCashierApplication = (id: number) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/client-credits/${id}/cashier-approval`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    paidCredit = (data: CreditPaidRequest) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/client-credits/debt-repayment`, data)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getCreditHistory = (creditId: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/client-credits/${creditId}/history`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getNotifications = (id: string, page: number, size: number, startDate: string, endDate: string) =>
        new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/notifications/all${id ? `/${id}` : ``}`,
            {params: {page, size, startDate, endDate}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const customerService = new CustomerService();
export default customerService;
