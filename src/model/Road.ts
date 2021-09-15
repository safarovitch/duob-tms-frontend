import React from "react";

export interface Road {
    id?: number;
    truckId: number;
    trailerId: number;
    driverId: number;
    departureDate: string;
    arrivalDate: string;
    road: string;
    description: string;
    refuelingOnWay: number;
    refuelingOnBase: number;
    speedometerBefore: number;
    speedometerAfter: number;
    totalKmDeparture: number;
    totalKmArrival: number;
    kmDepartureWithCargo: number;
    arrivalCargoWeight: number;
    departureCargoWeight: number;
    arrivalTrailerCargoWeight: number;
    departureTrailerCargoWeight: number;
    contractPriceUsd: number;
    contractPriceTjs: number;
    driverPriceUsd: number;
    driverPriceTjs: number;
    roadCostsUsd: number;
    roadCostsTjs: number;
    roadPriceUsd: number;
    roadPriceTjs: number;
    retentionUsd: number;
    retentionTjs: number;
}

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
    liftingCapacity: number;
    totalBodyCapacity: number;
}

export interface TrailerFormProps {
    className?: string;
    trailer: Trailer;
}
