import {
    DELETE_CARGO_TARIFF,
    DELETE_CARGO_TYPE,
    DELETE_CUSTOM_CODE,
    DELETE_PRODUCT, SET_CARGO_TARIFF,
    SET_CARGO_TYPE,
    SET_CUSTOM_CODE,
    SET_PRODUCT
} from "../actions/cargoActions";
import {CargoCustomCode, CargoProduct, CargoTariff, CargoType} from "../../model/Cargo";

export const productReducer = (state = null, action: { type: any; payload: CargoProduct | any; }) => {
    switch (action.type) {
        case SET_PRODUCT: {
            return action.payload;
        }
        case DELETE_PRODUCT: {
            return action.payload;
        }
        default: return state;

    }
}

export const customCodeReducer = (state = null, action: { type: any; payload: CargoCustomCode | any; }) => {
    switch (action.type) {
        case SET_CUSTOM_CODE: {
            return action.payload;
        }
        case DELETE_CUSTOM_CODE: {
            return action.payload;
        }
        default: return state;

    }
}

export const cargoTypeReducer = (state = null, action: { type: any; payload: CargoType | any; }) => {
    switch (action.type) {
        case SET_CARGO_TYPE: {
            return action.payload;
        }
        case DELETE_CARGO_TYPE: {
            return action.payload;
        }
        default: return state;

    }
}

export const cargoTariffReducer = (state = null, action: { type: any; payload: CargoTariff | any; }) => {
    switch (action.type) {
        case SET_CARGO_TARIFF: {
            return action.payload;
        }
        case DELETE_CARGO_TARIFF: {
            return action.payload;
        }
        default: return state;

    }
}
