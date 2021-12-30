import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {
    IncomeByArticleApplication,
    OutcomeByArticleApplication,
    OutcomeTransferWarehouseApplication,
    RefillBalanceApplication, RoadDriverApplicationRequest
} from "../model/Application";

class Application {
    getWarehouseSecondaryMoneyUnit = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/warehouses/secondary-money-unit`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    approveRefillBalance = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/money-transactions/fill-client-balance/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredRefillBalances =
        (page: number, size: number, search: string, startDate: string, endDate: string, status: string) =>
            new Promise((resolve, reject) => {
                api.get(`${API_BASE_URL}/applications/income-client-balance?${encodeURI(`extraParams[status]=${status}`)}`,
                    {params: {page, size, search, startDate, endDate}})
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
        api.get(`${API_BASE_URL}/money-transactions/income-by-article/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredIncomeArticles =
        (page: number, size: number, search: string, startDate: string, endDate: string, status: string) =>
            new Promise((resolve, reject) => {
                api.get(`${API_BASE_URL}/applications/income-by-article?${encodeURI(`extraParams[status]=${status}`)}`,
                    {params: {page, size, search, startDate, endDate}})
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
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
        api.get(`${API_BASE_URL}/money-transactions/outcome-by-article/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredOutcomeArticles =
        (page: number, size: number, search: string, startDate: string, endDate: string, status: string) =>
            new Promise((resolve, reject) => {
                api.get(`${API_BASE_URL}/applications/outcome-by-article?${encodeURI(`extraParams[status]=${status}`)}`,
                    {params: {page, size, search, startDate, endDate}})
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
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
        api.get(`${API_BASE_URL}/money-transactions/transfer-to-warehouse/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredOutcomeTransferWarehouses =
        (page: number, size: number, search: string, startDate: string, endDate: string, status: string) =>
            new Promise((resolve, reject) => {
                api.get(`${API_BASE_URL}/applications/outcome-transfer-warehouse?${encodeURI(`extraParams[status]=${status}`)}`,
                    {params: {page, size, search, startDate, endDate}})
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
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

    approveRoadDriver = (id: number) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/applications/road-and-driver/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredRoadDriver = (page: number, size: number, search: string, startDate: string, endDate: string) =>
        new Promise((resolve, reject) => {
            api.get(`${API_BASE_URL}/applications/road-and-driver`,
                {params: {page, size, search, startDate, endDate}})
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        })

    postRoadDriver = (roadDriver: RoadDriverApplicationRequest) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/applications/road-and-driver`, roadDriver)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteRoadDriver = (id: number) => new Promise((resolve, reject) => {
        api.delete(`${API_BASE_URL}/applications/road-and-driver/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
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
