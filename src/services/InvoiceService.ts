import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {CreateInvoiceRequest, UpdateInvoiceRequest} from "../model/Invoice";

class InvoiceService {
    getFilteredList = (page: number, size: number, startDate: string, endDate: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/invoices`, {params: {page, size, startDate, endDate}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    get = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/invoices/${id}`)
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

    postCopyInvoice = (id: number) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/invoices/${id}/copy`)
            .then(response => resolve(response))
            .catch(error => reject(error))
    })

    generateInvoice = (invoiceId: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/customs-invoice/excel/${invoiceId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getInvoice = (fileName: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/customs-invoice/excel/download/${fileName}`, {responseType: "arraybuffer"})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const invoiceService = new InvoiceService()

export default invoiceService