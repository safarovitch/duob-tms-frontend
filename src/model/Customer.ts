import React from "react";
import {CargoStuffTab} from "./Cargo";
import {StatusCargoEnum} from "../constants";

export interface CustomerFormProps {
    className?: string;
    customer?: Customer;
}

export interface Customer {
    id?: number;
    name: string;
    avatar?: string;
    phoneNumber: string;
    code: string;
    birthdate: string | null;
    address: string;
    username: string;
    password?: string | null;
    placeNumber?: number;
    amount?: number;
    balance?: number;
    creditBalance?: number;
    unconfirmedCredit?: number;
}

export interface CustomerStuffTab {
    value: string;
    label: string;
    hasBadge: boolean;
    perm: string[];
}

export interface CustomerTabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: CargoStuffTab;
}

export interface CustomerCargo {
    id?: number;
    amount: number;
    barcode: string;
    cargoTypeName: string;
    heightCargo: number;
    lengthCargo: number;
    productName: string;
    status: boolean;
    totalVolume: number;
    totalWeight: number;
    widthCargo: number;
    cargos: CargoGeneral[]
}

export interface CargoGeneral {
    roadId: number;
    warehouseId: number;
    description: string;
    barcode: string;
    status: StatusCargoEnum;
    dueDays: number;
    storagePrice: number;
    createdDate?: string;
    arrivalDate?: string;
    dateOfIssue?: string;
    updatedDate?: string;
    dateOfReturn?: string;
    deleted?: boolean;
}

export interface CustomerReconciliationAct {
    date: string;
    income: number;
    incomeQuantity: number;
    outcome: number;
    outcomeQuantity: number;
    balance: number;
    balanceQuantity: number;
    discount: number;
    discountQuantity: number;
}

export interface Credit {
    id: number;
    adminApproval: boolean;
    amount: number;
    balance: number;
    cashierApproval: boolean;
    createdDate: string;
    warehouseName: string;
    description: string;
    createdBy: string;
}

export interface CreditCreateRequest {
    clientId: number;
    warehouseId: number;
    amount?: number;
    description: string;
}

export interface CreditPaidRequest {
    parentId?: number;
    amount: number;
}

export interface CreditPaidResponse {
    createdDate: string;
    amount: number;
    createdBy: string;
}

