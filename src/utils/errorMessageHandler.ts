import {AxiosError} from "axios";

export default function errorMessageHandler(error: AxiosError): string {
    let errorMessage: string

    if (error.response) {
        switch (error.response.status) {
            case 409:
            case 406:
                errorMessage = `Произошла ошибка. ${error.response.data.title}`
                break
            default:
                errorMessage = `Ошибка сервера. Код ответа ${error.response.status}`
        }
    }
    else if (error.request) errorMessage = 'Нет подключения к Интернету'
    else errorMessage = `Произошла ошибка. ${error.message}`

    return errorMessage
}
