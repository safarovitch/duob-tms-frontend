import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {Driver} from "../model/Road";

class RoadService {
    getFilteredDrivers = (page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/drivers?page=${page}&size=${size}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    postDriver = (driver: Driver) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/drivers`, driver)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateDriver = (driver: Driver) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/drivers/${driver.id}`, driver)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    deleteDriver = (driverId: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/drivers/${driverId}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })
}

const roadService = new RoadService()
export default roadService
