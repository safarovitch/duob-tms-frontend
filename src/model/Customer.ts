import React from "react";
import {CargoStuffTab} from "./Cargo";

export interface CustomerListHeaderProps {
    className?: string;
}

export interface CustomerListProps {
    className?: string;
}

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

export interface CustomerActiveCargo {
    id?: number;
}

export interface CustomerReceivedCargo {
    id?: number;
}

export interface CustomerReconciliationAct {
    id?: number;
}
