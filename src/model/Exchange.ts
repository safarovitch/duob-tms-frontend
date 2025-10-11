import {Currency} from "../constants";

export type MoneyUnitType = 'TJS' | 'RUB' | 'USD' | 'CNY';

export interface Exchange {
    id: number,
    unit: Currency,
    currency: number
}

export interface CurrencyExchange {
    actualAmount: number;
    actualMoneyUnit: Currency;
    convertAmount: number;
    convertMoneyUnit: Currency;
    currency: number;
    totalConvertAmount?: number;
    totalAmount: number;
}
