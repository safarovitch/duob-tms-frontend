import api from '../utils/Api'
import {Fuel} from "../model/Fuel";
import {API_BASE_URL} from "../config";

class FuelService {
    getFilteredFuels = (page: number, size: number, query: string, startDate: string, endDate: string) =>
        new Promise((resolve, reject) => {
            api.get(`${API_BASE_URL}/fuels/transactions`, {params: {page, size, search: query, startDate, endDate}})
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {reject(error)})
    })

    postIncome = (fuel: Fuel) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/fuels/income`, fuel)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    postTransfusion = (fuel: Fuel) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/fuels/transfusion`, fuel)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    postOutcome = (fuel: Fuel) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/fuels/outcome`, fuel)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })
}

const fuelService = new FuelService()

export default fuelService
