import React from "react";
import {CargoStuffTab} from "./Cargo";

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
}

export interface CustomerStuffTab {
    value: string;
    label: string;
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
    cargos?: CargoGeneral[]
}

type CargoStatus = 'FORMALIZED' | 'ONROAD' | 'ARRIVED' | 'ISSUED';

interface CargoGeneral{
    roadId: number;
    warehouseId: number;
    description: string;
    barcode: string;
    status: CargoStatus;
    dueDays: number;
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
