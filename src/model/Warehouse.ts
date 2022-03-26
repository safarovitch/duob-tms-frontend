import {CargoGeneral} from "./Customer";
import {Currency, TypeCalculationCargoEnum} from "../constants";

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
    moneyBalanceUSD: number;
    secondaryMoneyBalance: number;
    secondaryMoneyUnit: Currency;
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
    syncDate?: string;
}

export interface WarehouseStateCargoRequest {
    id?: number;
    clientId: number;
    providerId: number;
    cargoTypeId: number;
    tariffId: number;
    productId: number;
    customCodeId: number;
    weightCargo: number;
    lengthCargo: number;
    widthCargo: number;
    heightCargo: number;
    typeCalculation: TypeCalculationCargoEnum;
    priceOne: number;
    createdDate?: string;
    updatedDate?: string;
}

export interface WarehouseStateTotal {
    totalPlace: number;
    amount: number;
    totalVolume: number;
    totalWeight: number;
}
