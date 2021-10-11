import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {
    IncomeByArticleApplication,
    OutcomeByArticleApplication,
    OutcomeTransferWarehouseApplication,
    RefillBalanceApplication
} from "../model/Application";

class Application {
    approveRefillBalance = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/money-transaction/fill-client-balance/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredRefillBalances = (page: number, size: number, search: string, startDate: string, endDate: string) =>
        new Promise((resolve, reject) => {
            api.get(`${API_BASE_URL}/applications/income-client-balance`, {
                params: {
                    page,
                    size,
                    search,
                    startDate,
                    endDate
                }
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        })

    postRefillBalance = (refillBalance: RefillBalanceApplication) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/applications/income-client-balance`, refillBalance)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    updateRefillBalance = (refillBalance: RefillBalanceApplication) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/applications/income-client-balance/${refillBalance.id}`, refillBalance)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })

    deleteRefillBalance = (refillBalanceId: number) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/applications/income-client-balance/${refillBalanceId}`)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })

    approveIncomeArticle = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/money-transaction/income-by-article/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredIncomeArticles = (page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/applications/income-by-article?page=${page}&size=${size}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })

    postIncomeArticle = (incomeArticle: IncomeByArticleApplication) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/applications/income-by-article`, incomeArticle)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })

    updateIncomeArticle = (incomeArticle: IncomeByArticleApplication) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/applications/income-by-article/${incomeArticle.id}`, incomeArticle)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })

    deleteIncomeArticle = (id: number) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/applications/income-by-article/${id}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })

    approveOutcomeArticle = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/money-transaction/outcome-by-article/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredOutcomeArticles = (page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/applications/outcome-by-article?page=${page}&size=${size}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })

    postOutcomeArticle = (outcomeArticle: OutcomeByArticleApplication) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/applications/outcome-by-article`, outcomeArticle)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })

    deleteOutcomeArticle = (id: number) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/applications/outcome-by-article/${id}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })

    approveTransferWarehouse = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/money-transaction/transfer-to-warehouse/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredOutcomeTransferWarehouses = (page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/applications/outcome-transfer-warehouse?page=${page}&size=${size}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })

    postOutcomeTransferWarehouse = (outcomeTransferWarehouse: OutcomeTransferWarehouseApplication) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/applications/outcome-transfer-warehouse`, outcomeTransferWarehouse)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })

    deleteOutcomeTransferWarehouse = (id: number) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/applications/outcome-transfer-warehouse/${id}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })

    uploadPhoto = (id: number, file: File) => new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append("file", file);

        api.put(`${API_BASE_URL}/applications/${id}/image/upload`, formData, {headers:
                {"Content-Type": "multipart/form-data",}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    approveAdminApplication = (id: number) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/applications/${id}/admin-approval`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const applicationService = new Application()

export default applicationService
