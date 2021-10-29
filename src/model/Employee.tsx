import {Warehouse} from "./Warehouse";
import {AccountabilityMoneyUnit, AccountabilityType} from "../constants";

export interface Employee {
    id?: number;
    name: string;
    roles?: [];
    rolesId: number[];
    username: string;
    password: string | null;
    code: string;
    birthdate: string;
    address: string;
    phoneNumber: string;
    avatar?: string;
    warehouseId?: number;
    warehouseDto?: Warehouse;
    accountability?: boolean;
}

export interface Role {
    id: number;
    name: string;
}

export interface EmployeeAccountabilityResponse {
    id: number;
    name: string;
    countOfUncheckedApplications: number;
    balanceUSD: number;
    balanceTJS: number;
}

export interface Accountability {
    id?: number;
    employeeId: number;
    type: AccountabilityType;
    description: string;
    amount: number;
    moneyUnit: AccountabilityMoneyUnit;
    updatedDate?: string;
    employeeName?: string;
    createdByName?: string;
    adminConfirmation?: boolean;
    cashierConfirmation?: boolean;
    filePath?: string;
}
