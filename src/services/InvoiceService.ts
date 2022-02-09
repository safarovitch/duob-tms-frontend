import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {CreateInvoiceRequest, UpdateInvoiceRequest} from "../model/Invoice";

class InvoiceService {
    getFilteredList = (page: number, size: number, startDate: string, endDate: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/invoices`, {params: {page, size, startDate, endDate}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getRoads = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/invoices/roads`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    post = (invoice: CreateInvoiceRequest) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/invoices/`, invoice)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    update = (invoice: UpdateInvoiceRequest) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/invoices/`, invoice)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

//    invoices/id/copy
}

const invoiceService = new InvoiceService()

export default invoiceService