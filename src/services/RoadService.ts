import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {Driver, Trailer, Truck} from "../model/Road";

class RoadService {
    getFilteredRoads = (page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/roads?page=${page}&size=${size}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

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

    getTrucks = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/trucks/all`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    getFilteredTrucks = (page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/trucks?page=${page}&size=${size}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    postTruck = (truck: Truck) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/trucks`, truck)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateTruck = (truck: Truck) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/trucks/${truck.id}`, truck)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    deleteTruck = (truckId: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/trucks/${truckId}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    getFilteredTrailers = (page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/trailers?page=${page}&size=${size}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    postTrailer = (trailer: Trailer) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/trailers`, trailer)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateTrailer = (trailer: Trailer) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/trailers/${trailer.id}`, trailer)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    deleteTrailer = (trailerId: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/trailers/${trailerId}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })
}

const roadService = new RoadService()
export default roadService
