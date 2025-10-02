import React from "react";
import {MoneyUnitType} from "./Exchange";

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

export interface RoadTruck {
    id: number;
    number: string;
    trailerNumber: string;
    driverName: string;
}

export interface RoadRequest {
    id?: number;
    road: string;
    truck?: RoadTruck;
    truckId?: number;
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

export type RoadFuelType = 'ON_BASE' | 'ON_ROAD' | 'ADDITIONAL_OUTCOME';

export interface RoadFuelDetail {
    id?: number;
    refuelingDate: string;
    liter: number;
    unit?: MoneyUnitType;
    price?: number;
    totalPrice?: number;
    description: string;
    type: RoadFuelType;
    roadId: number;
}

export interface Road {
    id?: number;
    road: string;
    truck: RoadTruck;
    trailer: {id: number, number: string};
    driver: {id: number, name: string};
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
    refuelingOnRoadPriceTjs: number;
    refuelingOnRoadPriceUsd: number;
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

export interface Truck {
    id?: number;
    type?: {id: number, name: string};
    typeId?: number;
    number: string;
    trailer?: {id: number, number: string};
    trailerId?: number;
    driver?: {id: number, name: string};
    driverId?: number;
    model: string;
    tankCapacity: number;
    liftingCapacity: number;
    totalBodyCapacity: number;
    residueOfTank?: number;
}

export interface Driver {
    id?: number;
    name: string;
    phoneNumber: string;
    address: string;
}

export interface Trailer {
    id?: number;
    number: string;
    liftingCapacity: number;
    totalBodyCapacity: number;
}

export interface TruckType {
    id?: number;
    name: string;
    shippingNormWithoutCargo: number;
    shippingNormWithCargo: number;
    shippingNormTrailer: number;
    returnNormWithoutCargo: number;
    returnNormWithCargo: number;
    returnNormTrailerWithCargo: number;
}
