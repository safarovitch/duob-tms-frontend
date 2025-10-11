import api from '../utils/Api'
import {Warehouse, WarehouseStateCargoRequest} from "../model/Warehouse";
import {API_BASE_URL} from "../config";
import apiHelper from "./ApiHelper";

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

    getFilteredWarehouseStateCargos = (warehouseId: number, status: string, startDate: string, endDate: string,
                                       clientCode: string, barcode: string, page: number, size: number) => {
        let extraParams: any = {status, clientCode, barcode}

        if (warehouseId !== 0) (extraParams.warehouseId = warehouseId)

        return apiHelper.get(`/warehouses/state`, {startDate, endDate, page, size, extraParams})
    }

    getFilteredWarehouseStateTotal = (warehouseId: number, status: string, startDate: string, endDate: string,
                                      clientCode: string, barcode: string) => {
        let extraParams: any = {status, clientCode, barcode}

        if (warehouseId !== 0) (extraParams.warehouseId = warehouseId)

        return apiHelper.get(`/warehouses/total`, {startDate, endDate, extraParams})
    }

    getWarehouseStateCargo = (cargoId: number) => new Promise((resolve, reject)  => {
        api.get(`${API_BASE_URL}/sync/income-cargos/${cargoId}/history`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getCargo = (cargoId: number) => new Promise((resolve, reject)  => {
        api.get(`${API_BASE_URL}/sync/income-cargos/${cargoId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    updateCargo = (cargo: WarehouseStateCargoRequest) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/sync/income-cargos/${cargo.id}`, cargo)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const warehouseService = new WarehouseService()
export default warehouseService;
