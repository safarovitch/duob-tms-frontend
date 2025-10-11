import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {
    IncomeByArticleApplication,
    OutcomeByArticleApplication,
    OutcomeTransferWarehouseApplication,
    RefillBalanceApplication, RoadDriverApplicationRequest
} from "../model/Application";
import {CurrencyExchange} from "../model/Exchange";
import {CashTotalApplicationEnum} from "../constants";
import apiHelper from "./ApiHelper";

class ApplicationService {
    getTotalCashierBalance = (
        type: CashTotalApplicationEnum,
        from: string,
        to: string,
        warehouseId?: number
    ) => apiHelper.get(`/applications/${type}/total`, {from, to, warehouseId})

    getWarehouseSecondaryMoneyUnit = () => apiHelper.get(`/warehouses/secondary-money-unit`)

    approveRefillBalance = (id: number, currencyExchangeData: CurrencyExchange) =>
        new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/money-transactions/fill-client-balance/${id}`, currencyExchangeData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredRefillBalances = (
        page: number,
        size: number,
        search: string,
        startDate: string,
        endDate: string,
        status: string
    ) => apiHelper.get(
        `/applications/income-client-balance`,
        {page, size, search, startDate, endDate, extraParams: {status}}
    )

    postRefillBalance = (refillBalance: RefillBalanceApplication) =>
        apiHelper.post<RefillBalanceApplication>(`/applications/income-client-balance`, refillBalance)

    updateRefillBalance = (refillBalance: RefillBalanceApplication) =>
        apiHelper.put<RefillBalanceApplication>(`/applications/income-client-balance/${refillBalance.id}`, refillBalance)

    deleteRefillBalance = (refillBalanceId: number) =>
        apiHelper.delete(`/applications/income-client-balance/${refillBalanceId}`)

    approveIncomeArticle = (id: number, currencyExchangeData: CurrencyExchange) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/money-transactions/income-by-article/${id}`, currencyExchangeData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredIncomeArticles = (
        page: number,
        size: number,
        search: string,
        startDate: string,
        endDate: string,
        status: string
    ) => apiHelper.get(
        `/applications/income-by-article`,
        {page, size, search, startDate, endDate, extraParams: {status}}
    )

    postIncomeArticle = (incomeArticle: IncomeByArticleApplication) =>
        apiHelper.post<IncomeByArticleApplication>(`/applications/income-by-article`, incomeArticle)

    updateIncomeArticle = (incomeArticle: IncomeByArticleApplication) =>
        apiHelper.put<IncomeByArticleApplication>(`/applications/income-by-article/${incomeArticle.id}`, incomeArticle)

    deleteIncomeArticle = (incomeArticleId: number) =>
        apiHelper.delete(`/applications/income-by-article/${incomeArticleId}`)

    approveOutcomeArticle = (id: number, currencyExchangeData: CurrencyExchange) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/money-transactions/outcome-by-article/${id}`, currencyExchangeData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredOutcomeArticles = (
        page: number,
        size: number,
        search: string,
        startDate: string,
        endDate: string,
        status: string
    ) => apiHelper.get(
        `/applications/outcome-by-article`,
        {page, size, search, startDate, endDate, extraParams: {status}}
    )

    postOutcomeArticle = (outcomeArticle: OutcomeByArticleApplication) =>
        apiHelper.post<OutcomeByArticleApplication>(`/applications/outcome-by-article`, outcomeArticle)

    deleteOutcomeArticle = (outcomeArticleId: number) =>
        apiHelper.delete(`/applications/outcome-by-article/${outcomeArticleId}`)

    approveTransferWarehouse = (id: number, currencyExchangeData: CurrencyExchange) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/money-transactions/transfer-to-warehouse/${id}`, currencyExchangeData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    approveSecondCashierTransferWarehouse = (id: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/money-transactions/transfer-to-warehouse/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredOutcomeTransferWarehouses = (
        page: number,
        size: number,
        search: string,
        startDate: string,
        endDate: string,
        status: string
    ) => apiHelper.get(
        `/applications/outcome-transfer-warehouse`,
        {page, size, search, startDate, endDate, extraParams: {status}}
    )

    postOutcomeTransferWarehouse = (outcomeTransferWarehouse: OutcomeTransferWarehouseApplication) =>
        apiHelper.post<OutcomeTransferWarehouseApplication>(`/applications/outcome-transfer-warehouse`, outcomeTransferWarehouse)

    deleteOutcomeTransferWarehouse = (outcomeTransferWarehouseId: number) =>
        apiHelper.delete(`/applications/outcome-transfer-warehouse/${outcomeTransferWarehouseId}`)

    approveRoadDriver = (id: number) => new Promise((resolve, reject) => {
        api.put(`${API_BASE_URL}/applications/road-and-driver/${id}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getFilteredRoadDriver = (
        page: number,
        size: number,
        search: string,
        startDate: string,
        endDate: string
    ) => apiHelper.get(`/applications/road-and-driver`, {page, size, search, startDate, endDate})

    postRoadDriver = (roadDriver: RoadDriverApplicationRequest) =>
        apiHelper.post<RoadDriverApplicationRequest>(`/applications/road-and-driver`, roadDriver)

    deleteRoadDriver = (roadDriverId: number) =>
        apiHelper.delete(`/applications/road-and-driver/${roadDriverId}`)

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

const applicationService = new ApplicationService()

export default applicationService
