import React from "react";

export interface RoadStuffTab {
    value: string;
    label: string;
}

export interface RoadTabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: RoadStuffTab;
}

export interface Driver {
    id?: number;
    name: string;
    phoneNumber: string;
    address: string;
}

export interface DriverFormProps {
    className?: string;
    driver: Driver;
}

export interface Truck {
    id?: number;
    type: string;
    tankCapacity: number;
    liftingCapacity: number;
    number: string;
    totalBodyCapacity: number;
    residueOfTank?: number;
}

export interface TruckFormProps {
    className?: string;
    truck: Truck;
}

export interface Trailer {
    id?: number;
    number: string;
    truckNumber?: string;
    truckId?: number;
    liftingCapacity: number;
    totalBodyCapacity: number;
}

export interface TrailerFormProps {
    className?: string;
    trailer: Trailer;
    trucks: Truck[];
}
