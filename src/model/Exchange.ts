import {Currency} from "../constants";

export type MoneyUnitType = 'TJS' | 'RUB' | 'USD' | 'CNY';

export interface Exchange {
    id: number,
    unit: Currency,
    currency: number
}

export interface CurrencyExchangeRequest {
    actualMoneyUnit: Currency;
    actualAmount: number;
    convert?: boolean;
    convertMoneyUnit?: Currency;
    currency?: number;
    convertAmount?: number;
}
