import {Warehouse} from "./Warehouse";
import {AccountabilityType, Currency} from "../constants";
import {CurrencyExchange} from "./Exchange";

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
    secondaryBalance: number;
    secondaryMoneyUnit: Currency;
}

export interface Accountability extends CurrencyExchange{
    id?: number;
    employeeId: number;
    type: AccountabilityType;
    description: string;
    updatedDate?: string;
    employeeName?: string;
    createdByName?: string;
    adminConfirmation?: boolean;
    cashierConfirmation?: boolean;
    filePath?: string;
}
