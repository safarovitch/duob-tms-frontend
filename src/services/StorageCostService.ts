import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {StorageCost} from "../model/StorageCost";

class StorageCostService {
    getFilteredStorageCosts = (page: number, size: number) => new Promise((resolve, reject)  => {
        api.get(`${API_BASE_URL}/cargo-storages`, {params: {page, size}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    postNewStorageCost = (storageCost: StorageCost) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/cargo-storages`, storageCost)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const storageCost = new StorageCostService()

export default storageCost