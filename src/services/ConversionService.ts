import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {Conversion} from "../model/Conversion";

class ConversionService {
    getFilteredConversions = (page: number, size: number, search: string, startDate: string, endDate: string) =>
        new Promise((resolve, reject) => {
            api.get(`${API_BASE_URL}/exchanges/transactions`,
                {params: {page, size, search, startDate, endDate}})
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        })

    postNewConversion = (conversion: Conversion) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/exchanges/transactions`, conversion)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const conversionService = new ConversionService()

export default conversionService