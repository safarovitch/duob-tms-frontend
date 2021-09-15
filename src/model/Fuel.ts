export interface Fuel {
    id?: number;
    type?: string;
    roles?: string[];
    volume: number;
    fromTruck?: number;
    fromTruckId?: number;
    toTruck?: number;
    toTruckId?: number;
    description: string;
    createdDate?: string;
}
