import React from "react";

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
    code: string | null;
    price: number | null;
    baseRate: number | null;
    vat: number | null;
    totalRate: number | null;
    description: string | null;
    unit: Units | Units.ton;
    productId?: number;
    productDto?: CargoProduct
}

export enum Units {
    ton = 'TON',
    thing = 'THING'
}
