import api from '../utils/Api'
import {Warehouse} from "../model/Warehouse";
import {API_BASE_URL} from "../config";

class WarehouseService {
    getWarehouseBalances = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/warehouses/balances`)
            .then((response) => resolve(response.data))
            .catch(error => reject(error))
    })

    getAllWarehouse = () => new Promise((resolve, reject)  => {
        api.get(`${API_BASE_URL}/warehouses/all`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    getFilteredWarehouse = (page: number, size: number, query: string) => new Promise((resolve, reject)  => {
        api.get(`${API_BASE_URL}/warehouses`, {params: {page, size, search: query}})
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    postNewWarehouse = (warehouse: Warehouse) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/warehouses`, warehouse)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    updateWarehouse = (warehouse: Warehouse) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/warehouses/${warehouse.id}`, warehouse)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    deleteWarehouse = (id: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/warehouses/${id}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })
}

const warehouseService = new WarehouseService()
export default warehouseService;
