export interface GetRoadsResponse {
    id: number;
    road: string;
}

export interface CreateInvoiceRequest {
    roadId: number;
    percent: number;
    provider: string;
    receiver: string;
    number: string;
    description: string;
}

export interface CargoInvoiceRequestList {
    id: number;
    customCodeId: number;
    quantity: number;
    weight: number;
    price: number;
    totalPrice: number;
    ccPrice: number;
}

export interface UpdateInvoiceRequest {
    id: number;
    provider: string;
    receiver: string;
    percent: number;
    number: string;
    totalUsd: number;
    totalTjs: number;
    quantity: number;
    weight: number;
    ccPriceUsd: number;
    ccPriceTjs: number;
    description: string;
    cargoInvoiceRequestList: CargoInvoiceRequestList[]
}

export interface CargoInvoiceProjection extends CargoInvoiceRequestList {
    createdDate: string;
    customCodeKgPerPlace: number;
    customCodePercent: number;
    customCodePrice: number;
    productId: number;
}

export interface GetListInvoiceResponse {
    id: number;
    number: string;
    createdDate: string;
    currency: number;
    provider: string;
    receiver: string;
    truckNumber: string;
    trailerNumber: string;
    percent: number;
    description: string;
    weight: number;
    quantity: number;
    totalUsd: number;
    totalTjs: number;
    ccPriceUsd: number;
    ccPriceTjs: number;
    copy: boolean;
    cargoInvoiceProjection: CargoInvoiceProjection[]
}