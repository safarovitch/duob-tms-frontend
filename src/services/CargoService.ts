import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {CargoCustomCode, CargoProduct, CargoTariff, CargoType} from "../model/Cargo";
import apiHelper from "./ApiHelper";

class CustomerService {
    getOptionProducts = () => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/products/option`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredProducts = (page: number, size: number, query: string) => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/products?page=${page}&size=${size}&search=${query}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    postProduct = (product: CargoProduct) => new Promise((resolve, reject)  => {
        api.post(API_BASE_URL + `/products`, product)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })
    updateProduct = (product: CargoProduct) => new Promise((resolve, reject)  => {
        api.put(API_BASE_URL + `/products`, product)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    setDefaultProduct = (productId: number) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/products/${productId}`)
            .then((response) => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteProduct = (productId: number) => new Promise((resolve, reject)  => {
        api.delete(API_BASE_URL + `/products/`+productId)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    getOptionCustomCodes = () => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/customs-codes/option`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredCustomCodes = (page: number, size: number, query: string) => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/customs-codes?page=${page}&size=${size}&search=${query}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    postCustomCode = (customCode: CargoCustomCode) => new Promise((resolve, reject)  => {
        api.post(API_BASE_URL + `/customs-codes`, customCode)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })
    updateCustomCode = (customCode: CargoCustomCode) => new Promise((resolve, reject)  => {
        api.put(API_BASE_URL + `/customs-codes`, customCode)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    setDefaultCustomCode = (customCodeId: number) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/customs-codes/${customCodeId}`)
            .then((response) => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteCustomCode = (customCodeId: number) => new Promise((resolve, reject)  => {
        api.delete(API_BASE_URL + `/customs-codes/`+customCodeId)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    getOptionCargoTypes = () => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/cargos-types/option`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredCargoTypes = (page: number, size: number, query: string) => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/cargos-types?page=${page}&size=${size}&search=${query}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    postCargoType = (cargoType: CargoType) => new Promise((resolve, reject)  => {
        api.post(API_BASE_URL + `/cargos-types`, cargoType)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })
    updateCargoType = (cargoType: CargoType) => new Promise((resolve, reject)  => {
        api.put(API_BASE_URL + `/cargos-types`, cargoType)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    setDefaultCargoType = (cargoTypeId: number) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/cargos-types/${cargoTypeId}`)
            .then((response) => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteCargoType = (cargoTypeId: number) => new Promise((resolve, reject)  => {
        api.delete(API_BASE_URL + `/cargos-types/`+cargoTypeId)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    getOptionCargoTariffs = (tariffId: number) => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/tariffs/option?tariffId=${tariffId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredCargoTariffs = (page: number, size: number, query: string) => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/tariffs?page=${page}&size=${size}&search=${query}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    getHistoryCargoTariff = (id: number) => new Promise((resolve, reject)  => {
        api.get(API_BASE_URL + `/tariffs/${id}/history`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getPrevDateCargoTariff = (id: number) => apiHelper.get(`/tariffs/${id}/prev-date`)

    postCargoTariff = (cargoTariff: CargoTariff) => new Promise((resolve, reject)  => {
        api.post(API_BASE_URL + `/tariffs`, cargoTariff)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    updateCargoTariff = (cargoTariff: CargoTariff) => new Promise((resolve, reject)  => {
        api.put(API_BASE_URL + `/tariffs`, cargoTariff)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    setDefaultCargoTariff = (cargoTariffId: number) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/tariffs/${cargoTariffId}`)
            .then((response) => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteCargoTariff = (cargoTariffId: number) => new Promise((resolve, reject)  => {
        api.delete(API_BASE_URL + `/tariffs/`+cargoTariffId)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {reject(error)})
    })

    getFilteredCargoIssues = (page: number, size: number, query: string) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/applications/cargo-issues?page=${page}&size=${size}&search=${query}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getCargoIssue = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/applications/cargo-issues/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    approveCargoIssue = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/money-transactions/cargo-issue/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    creditCargoIssue = (id: number) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/applications/cargo-issue/${id}/credit`)
            .then((response) => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteCargoIssue = (id: number) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/applications/cargo-issues/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const cargoService = new CustomerService();
export default cargoService;
