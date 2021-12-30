import {CargoGeneral} from "./Customer";
import {Currency} from "../constants";

export interface Warehouse {
    id?: number;
    secondaryMoneyUnit: Currency;
    name: string;
    destination: boolean;
}

export interface WarehouseListProps {
    className?: string;
}

export interface WarehouseListHeaderProps {
    className?: string;
}

export interface WarehouseFormProps {
    className?: string;
    warehouse?: Warehouse;
}

export interface WarehouseBalance {
    moneyBalanceTJS: number;
    moneyBalanceUSD: number;
    moneyBalanceRUB: number;
    moneyBalanceCNY: number;
}

export interface WarehouseStateCargo {
    id?: number;
    createdDate: string;
    createdBy: string;
    updatedBy: string;
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
    cargos: CargoGeneral[];
    clientCode: string;
    providerCode: string;
    groupCargo: boolean;
    date: string;
}

export interface WarehouseStateTotal {
    place: number;
    price: number;
    volume: number;
}
