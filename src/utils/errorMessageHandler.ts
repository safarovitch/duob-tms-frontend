import {AxiosError} from "axios";

export default function errorMessageHandler(error: AxiosError): string {
    let errorMessage: string

    if (error.response) {
        if (error.response.status === 409) {
            errorMessage = `Произошла ошибка. ${error.response.data.title}`;
        } else {
            errorMessage = `Ошибка сервера. Код ответа ${error.response.status}`
        }
    }
    else if (error.request) errorMessage = 'Нет подключения к Интернету'
    else errorMessage = `Произошла ошибка. else ${error.message}`

    return errorMessage
}
