import {Article} from "../model/Article";
import apiHelper from "./ApiHelper";

class ArticleService {
    getArticles = (type: string) => apiHelper.get(`/articles/all/${type}`)

    getFilteredArticles = (type: string, page: number, size: number) =>
        apiHelper.get(`/articles`, {type, page, size})

    postArticle = (postfix: string, article: Article) => apiHelper.post<Article>(`/articles/${postfix}`, article)

    updateArticle = (article: Article) => apiHelper.put<Article>(`/articles/${article.id}`, article)

    deleteArticle = (articleId: number) => apiHelper.delete(`/articles/${articleId}`)
}

const articleService = new ArticleService()
export default articleService
