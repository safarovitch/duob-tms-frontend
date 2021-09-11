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
    truckType: string;
    tankCapacity: number;
    liftingCapacity: number;
    truckNumber: string;
    totalBodyCapacity: number;
    residueOfTank?: number;
}

export interface TruckFormProps {
    className?: string;
    truck: Truck;
}
