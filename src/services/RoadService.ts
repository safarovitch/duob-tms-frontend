import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {
    Driver, RoadFuelDetail,
    RoadFuelRequest,
    RoadMileageRequest,
    RoadMoneyRequest,
    RoadRequest,
    Trailer,
    Truck,
    TruckType
} from "../model/Road";

class RoadService {
    getFilteredRoads = (page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/roads?page=${page}&size=${size}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    getRoadsBalance = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/roads/balance`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getRoadById = (id: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/roads/${id}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    getRoadCargos = (id: number, page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/roads/${id}/income-cargos/?page=${page}&size=${size}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getRoadFuelDetails = (roadId: number, type: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/road-fuels?roadId=${roadId}&type=${type}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    postRoadFuelDetail = (roadFuelDetail: RoadFuelDetail) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/road-fuels`, roadFuelDetail)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateRoadFuelDetail = (roadFuelDetail: RoadFuelDetail) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/road-fuels`, roadFuelDetail)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    deleteRoadFuelDetail = (fuelId: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/road-fuels/${fuelId}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    postRoad = (road: RoadRequest) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/roads`, road)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateRoad = (road: RoadRequest) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/roads/1`, road)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateRoadMileage = (road: RoadMileageRequest) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/roads/4`, road)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateRoadMoney = (road: RoadMoneyRequest) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/roads/3`, road)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateRoadFuel = (road: RoadFuelRequest) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/roads/2`, road)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    deleteRoad = (roadId: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/roads/${roadId}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    generateInvoice = (roadId: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/customs-invoice/excel/${roadId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getInvoice = (fileName: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/customs-invoice/excel/download/${fileName}`, {responseType: "arraybuffer"})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    completeRoad = (roadId: number) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/roads/${roadId}/complete`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getDrivers = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/drivers/all`)
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

    getActiveTrucks = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/trucks/active`)
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

    getTrailers = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/trailers/all`)
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

    getTruckTypes = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/truck-types/all`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    getFilteredTruckTypes = (page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/truck-types?page=${page}&size=${size}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    postTruckType = (truckType: TruckType) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/truck-types`, truckType)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateTruckType = (truckType: TruckType) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/truck-types/${truckType.id}`, truckType)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    deleteTruckType = (truckTypeId: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/truck-types/${truckTypeId}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })
}

const roadService = new RoadService()
export default roadService
