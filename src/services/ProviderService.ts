import api from '../utils/Api'
import {Provider} from "../model/Provider";
import {API_BASE_URL} from "../config";

class ProviderService {
    getFilteredProvider = (page: number, size: number, query: string) => new Promise((resolve, reject)  => {
        api.get(`${API_BASE_URL}/providers`, {params: {page, size, search: query}})
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {reject(error)})
    })

    postNewProvider = (provider: Provider) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/providers`, provider)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    updateProvider = (provider: Provider) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/providers/${provider.id}`, provider)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    deleteProvider = (id: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/providers/${id}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })
}

const providerService = new ProviderService()
export default providerService;
