import {Provider} from "../../model/Provider";

export const SET_PROVIDER = '@provider/set-selected-provider';
export const DELETE_PROVIDER = '@provider/delete-selected-provider';
export const setSelectedProvider = (provider: Provider) => {
    return {
        type: SET_PROVIDER,
        payload: provider
    }
}
export const deleteSelectedProvider = () => {
    return {
        type: DELETE_PROVIDER,
        payload: null
    }
}
