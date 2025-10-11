import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {Notification} from "../model/Notification";

class NotificationService {
    getFilteredNotifications = (page: number, size: number, search: string, startDate: string, endDate: string) =>
        new Promise((resolve, reject) => {
            api.get(`${API_BASE_URL}/notifications/all/privated-messages`, {params: {page, size, search, startDate, endDate}})
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        })

    postNewNotification = (notification: Notification) => new Promise((resolve, reject) => {
        api.post(`${API_BASE_URL}/notifications/send-privated-message`, notification)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getCargoArrived = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/notifications/cargo-arrival`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getCargoExpiration = () => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/notifications/expired-cargo-storage`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const notificationService = new NotificationService()

export default notificationService