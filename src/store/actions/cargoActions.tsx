import {CargoCustomCode, CargoProduct} from "../../model/Cargo";

export const SET_PRODUCT = '@cargo/set-selected-product';
export const DELETE_PRODUCT = '@cargo/delete-selected-product';
export const SET_CUSTOM_CODE = '@cargo/set-selected-custom-code';
export const DELETE_CUSTOM_CODE = '@cargo/delete-selected-custom-code';
export const setSelectedProduct = (product: CargoProduct) => {
    return {
        type: SET_PRODUCT,
        payload: product
    }
}
export const deleteSelectedProduct = () => {
    return {
        type: DELETE_PRODUCT,
        payload: null
    }
}

export const setSelectedCustomCode = (customCode: CargoCustomCode) => {
    return {
        type: SET_CUSTOM_CODE,
        payload: customCode
    }
}
export const deleteSelectedCustomCode = () => {
    return {
        type: DELETE_CUSTOM_CODE,
        payload: null
    }
}
