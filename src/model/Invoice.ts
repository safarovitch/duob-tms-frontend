export interface CreateInvoiceRequest {
    roadId: number;
    percent: number;
    provider: string;
    receiver: string;
    number: string;
    description: string;
}

export interface UpdateInvoiceRequest {

}

export interface GetRoadsResponse {
    id: number;
    road: string;
}

export interface GetListInvoiceResponse {
    id: number;
    number: string;
    description: string;
    truckNumber: string;
    provider: string;
    receiver: string;
    createdDate: string;
}