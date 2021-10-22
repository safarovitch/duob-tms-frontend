import {Currency} from "../constants";

export interface Exchange {
    id: number,
    unit: Currency,
    currency: number
}
