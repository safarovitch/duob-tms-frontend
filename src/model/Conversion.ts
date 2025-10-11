import {Currency} from "../constants";

export interface Conversion {
    id?: number;
    createdDate?: string;
    createdBy?: string;
    warehouseName?: string;
    actualAmount: number;
    actualMoneyUnit: Currency;
    currency: number;
    convertAmount: number;
    convertMoneyUnit: Currency;
    description: string;
}