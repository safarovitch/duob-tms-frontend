import api from "../utils/Api";
import {API_BASE_URL} from "../config";
import {Article} from "../model/Article";

class ArticleService{
    getFilteredArticles = (type: string, page: number, size: number) => new Promise((resolve, reject) => {
        api.get(`${API_BASE_URL}/articles?type=${type}&page=${page}&size=${size}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    postArticle = (postfix: string, article: Article) => new Promise((resolve, reject)  => {
        api.post(`${API_BASE_URL}/articles/${postfix}`, article)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    updateArticle = (article: Article) => new Promise((resolve, reject)  => {
        api.put(`${API_BASE_URL}/articles/${article.id}`, article)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })

    deleteArticle = (articleOutcomeId: number) => new Promise((resolve, reject)  => {
        api.delete(`${API_BASE_URL}/articles/${articleOutcomeId}`)
            .then((response) => {resolve(response.data)})
            .catch((error) => {reject(error)})
    })
}

const articleService = new ArticleService()
export default articleService
