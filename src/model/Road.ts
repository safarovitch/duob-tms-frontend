import React from "react";

export interface RoadList {
    id: number;
    road: string;
    truck: {id: number, number: string};
    status: number | boolean;
}

export interface RoadsStuffTab {
    value: string;
    label: string;
    privateTruck: boolean;
}

export interface RoadRequest {
    id?: number;
    road: string;
    truck?: {id: number, number: string};
    truckId?: number;
    driver?: {id: number, name: string};
    driverId?: number;
    departureDate: string;
    arrivalDate: string;
    description: string;
    privateTruck?: boolean;
    withTrailer?: boolean;
    status: number | boolean;
}

export interface RoadMileageRequest {
    id?: number;
    speedometerBefore: number;
    speedometerAfter: number;
    totalKmDeparture: number;
    totalKmArrival: number;
    kmDepartureWithCargo: number;
    kmArrivalWithCargo: number;
    departureCargoWeight: number;
    arrivalCargoWeight: number;
    departureTrailerCargoWeight: number;
    arrivalTrailerCargoWeight: number;
    totalKmInFact?: number;
    totalKmInSpeedometer?: number;
    speedometerDifference?: number;
}

export interface RoadMoneyRequest {
    id?: number;
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
    totalContractPriceUsd?: number;
    totalContractPriceTjs?: number;
}

export interface RoadFuelRequest {
    id?: number;
    fuelBalanceBeforeDeparture?: number;
    refuelingOnBase: number;
    refuelingOnWay: number;
    totalRefueling?: number;
    fuelOutcomeDepartureWithoutCargo?: number;
    fuelOutcomeDepartureWithCargo?: number;
    fuelOutcomeDepartureWithTrailer?: number;
    totalFuelOutcomeDeparture?: number;
    fuelOutcomeArrivalWithoutCargo?: number;
    fuelOutcomeArrivalWithCargo?: number;
    fuelOutcomeArrivalWithCargoAndTrailer?: number;
    totalFuelOutcomeArrival?: number;
    totalFuelOutcome?: number;
    additionalFuelOutcome: number;
    tankBalanceAfterArrival?: number;
}

export interface Road {
    id?: number;
    road: string;
    truck: {id: number, number: string};
    driver?: {id: number, name: string};
    departureDate: string;
    arrivalDate: string;
    description: string;
    privateTruck: boolean;
    withTrailer: boolean;
    status: number | boolean;
    speedometerBefore: number;
    speedometerAfter: number;
    totalKmDeparture: number;
    totalKmArrival: number;
    kmDepartureWithCargo: number;
    kmArrivalWithCargo: number;
    departureCargoWeight: number;
    arrivalCargoWeight: number;
    departureTrailerCargoWeight: number;
    arrivalTrailerCargoWeight: number;
    totalKmInFact: number;
    totalKmInSpeedometer: number;
    speedometerDifference: number;
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
    totalContractPriceUsd:number;
    totalContractPriceTjs: number;
    fuelBalanceBeforeDeparture: number;
    refuelingOnBase: number;
    refuelingOnWay: number;
    totalRefueling: number;
    fuelOutcomeDepartureWithoutCargo: number;
    fuelOutcomeDepartureWithCargo: number;
    fuelOutcomeDepartureWithTrailer: number;
    totalFuelOutcomeDeparture: number;
    fuelOutcomeArrivalWithoutCargo: number;
    fuelOutcomeArrivalWithCargo: number;
    fuelOutcomeArrivalWithCargoAndTrailer: number;
    totalFuelOutcomeArrival: number;
    totalFuelOutcome: number;
    additionalFuelOutcome: number;
    tankBalanceAfterArrival: number;
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
    trailerNumber?: string;
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
