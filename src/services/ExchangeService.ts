import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {Exchange} from "../model/Exchange";

class ExchangeService {
    getAllExchanges = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/exchanges`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    postNewExchange = (exchange: Exchange) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/exchanges`, exchange)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    updateExchange = (exchange: Exchange) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/exchanges`, exchange)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteExchange = (id: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/exchanges/${id}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })
}

const exchangeService = new ExchangeService()
export default exchangeService
