import {Article} from "../../model/Article";

export const SET_ARTICLE_INCOME = '@cargo/set-selected-article-income';
export const DELETE_ARTICLE_INCOME = '@cargo/delete-selected-article-income';
export const SET_ARTICLE_OUTCOME = '@cargo/set-selected-article-outcome';
export const DELETE_ARTICLE_OUTCOME = '@cargo/delete-selected-article-outcome';

export const setSelectedArticleIncome = (articleIncome: Article) => {
    return {
        type: SET_ARTICLE_INCOME,
        payload: articleIncome
    }
}

export const deleteSelectedArticleIncome = () => {
    return {
        type: DELETE_ARTICLE_INCOME,
        payload: null
    }
}

export const setSelectedArticleOutcome = (articleOutcome: Article) => {
    return {
        type: SET_ARTICLE_OUTCOME,
        payload: articleOutcome
    }
}

export const deleteSelectedArticleOutcome = () => {
    return {
        type: DELETE_ARTICLE_OUTCOME,
        payload: null
    }
}
