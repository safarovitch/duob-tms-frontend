import {Warehouse} from "./Warehouse";

export type Employee = {
    id?: number,
    name: string,
    roles?: [],
    rolesId: number[],
    username: string,
    password: string | null,
    code: string,
    birthdate: string,
    address: string,
    phoneNumber: string,
    avatar?: string,
    warehouseId?: number,
    warehouseDto?: Warehouse
}

export interface Role {
    id: number,
    name: string
}
