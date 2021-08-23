import React from "react";
import {Warehouse} from "./Warehouse";

export interface CargoStuffTab {
    value: string;
    label: string;
}

export interface CargoTabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: CargoStuffTab;
}

export interface CargoProduct {
    id?: number;
    name: string;
}

export interface ProductFormProps {
    className?: string;
    product: CargoProduct;
}

export interface CustomCodeFormProps {
    className?: string;
    customCode: CargoCustomCode;
}

export interface CargoCustomCode {
    id?: number;
    code?: string;
    price?: number;
    baseRate?: number;
    vat?: number;
    totalRate?: number;
    description?: string;
    unit: Units | Units.ton;
    productId?: number;
    productDto?: CargoProduct

    //helpers
    isUnitThing?: boolean;
}

export enum Units {
    ton = 'TON',
    thing = 'THING'
}

export interface CargoType {
    id?: number;
    name: string;
    manualPrice: boolean;
    negotiatedPrice: boolean;
    calculationRateWeight: boolean;
    discount: boolean;
}
export interface CargoTypeFormProps {
    className?: string;
    cargoType: CargoType;
}

export interface CargoTariff {
    id?: number;
    name: string;
    description: string;
    cubedPrice?: number;
    kgNegotiatedPrice?: number;
    kgPrice?: number;
    bottomMassInCube?: number;
    middleMassInCube?: number;
    topMassInCube?: number;
    bottomDiscount?: number;
    middleDiscount?: number;
    kgNormInCube?: number;
    maxRoadMassInCube?: number;
    maxRoadCube?: number;
    maxRoadMass?: number;
    totalMass?: number;
    totalCube?: number;
    totalPrice?: number;
    warehouseId?: number;
    cargoTypeId?: number;
    warehouseDto?: Warehouse;
    cargoTypeDto?: CargoType;
}
export interface CargoTariffFormProps {
    className?: string;
    cargoTariff: CargoTariff;
}
