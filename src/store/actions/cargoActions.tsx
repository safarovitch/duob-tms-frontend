import {CargoCustomCode, CargoProduct, CargoTariff, CargoType} from "../../model/Cargo";

export const SET_PRODUCT = '@cargo/set-selected-product';
export const DELETE_PRODUCT = '@cargo/delete-selected-product';
export const SET_CUSTOM_CODE = '@cargo/set-selected-custom-code';
export const DELETE_CUSTOM_CODE = '@cargo/delete-selected-custom-code';
export const SET_CARGO_TYPE = '@cargo/set-selected-cargo-type';
export const DELETE_CARGO_TYPE = '@cargo/delete-selected-cargo-type';
export const SET_CARGO_TARIFF = '@cargo/set-selected-cargo-tariff';
export const DELETE_CARGO_TARIFF = '@cargo/delete-selected-cargo-tariff';
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

export const setSelectedType = (cargoType: CargoType) => {
    return {
        type: SET_CARGO_TYPE,
        payload: cargoType
    }
}
export const deleteSelectedCargoType = () => {
    return {
        type: DELETE_CARGO_TYPE,
        payload: null
    }
}
export const setSelectedCargoTariff = (cargoTariff: CargoTariff) => {
    return {
        type: SET_CARGO_TARIFF,
        payload: cargoTariff
    }
}
export const deleteSelectedCargoTariff = () => {
    return {
        type: DELETE_CARGO_TARIFF,
        payload: null
    }
}
