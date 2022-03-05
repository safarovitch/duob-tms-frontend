import React from "react";
import {Customer} from "./Customer";
import {Article} from "./Article";
import {Employee} from "./Employee";
import {Warehouse} from "./Warehouse";
import {CurrencyExchange} from "./Exchange";
import {ApplicationStatusEnum, Currency, RoadDriverApplicationType} from "../constants";

export interface WarehouseSecondaryMoneyUnit {
    secondaryMoneyUnit: Currency;
    secondaryMoneyCurrency: number
}

export interface ApplicationStuffTab {
    value: string;
    label: string;
}

export interface ApplicationTabPanelProps {
    index: string;
    value: string;
    children?: React.ReactNode;
}

export interface CashTotalApplication {
    actualAmountIncome: number;
    convertAmountIncome: number;
    actualAmountOutcome: number;
    convertAmountOutcome: number;
    convertMoneyUnit: Currency;
}

interface CreatedBy {
    id: number;
    name: string;
}

export type RefillBalanceTypeAction = 'REFILL' | 'RETURN';

export interface RefillBalanceApplication extends CurrencyExchange {
    id?: number;
    createdDate?: string;
    createdBy?: CreatedBy;
    cashierName?: string;
    client?: Customer;
    clientId: number;
    actionType: RefillBalanceTypeAction;
    status?: ApplicationStatusEnum;
    images?: string;
    description: string;
    updatedDate?: string;
}

export interface RefillBalanceFormProps {
    refillBalance: RefillBalanceApplication;
    customers: Customer[];
    warehouseSecondaryMoneyUnit: WarehouseSecondaryMoneyUnit;
}

export interface IncomeByArticleApplication extends CurrencyExchange {
    id?: number;
    createdBy?: CreatedBy;
    cashierName?: string;
    article?: Article,
    articleId: number;
    status?: ApplicationStatusEnum;
    images?: string;
    description: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface IncomeByArticleFormProps {
    incomeArticle: IncomeByArticleApplication;
    articles: Article[];
    warehouseSecondaryMoneyUnit: WarehouseSecondaryMoneyUnit
}

export interface OutcomeByArticleApplication extends CurrencyExchange {
    id?: number;
    createdBy?: CreatedBy;
    employee?: Employee;
    employeeId?: number;
    cashierName?: string;
    adminApproval?: boolean;
    article?: Article;
    articleId?: number;
    status?: ApplicationStatusEnum;
    images?: string;
    description: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface OutcomeByArticleFormProps {
    articles: Article[];
    employees: Employee[];
    warehouseSecondaryMoneyUnit: WarehouseSecondaryMoneyUnit;
}

export interface OutcomeTransferWarehouseApplication extends CurrencyExchange {
    id?: number;
    createdBy?: CreatedBy;
    toWarehouseId?: number;
    toWarehouse?: Warehouse;
    fromWarehouse?: Warehouse;
    fromCashier?: {
        id: number;
        name: string;
    };
    toCashier?: {
        id: number;
        name: string;
    };
    adminApproval?: boolean;
    status?: ApplicationStatusEnum;
    images?: string;
    description: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface OutcomeTransferWarehouseFormProps {
    warehouses: Warehouse[];
    warehouseSecondaryMoneyUnit: WarehouseSecondaryMoneyUnit;
}

export interface RoadBalanceApplicationResponse {
    id: number;
    roadWithId: string;
    incomeBalanceTjs: number;
    incomeBalanceUsd: number;
    outcomeBalanceTjs: number;
    outcomeBalanceUsd: number;
    driverName: string;
}

export interface RoadDriverApplicationRequest {
    roadId: number;
    type: RoadDriverApplicationType;
    actualAmount: number;
    actualMoneyUnit: Currency;
    balanceTjs: number;
    balanceUsd: number;
    description: string;
}

export interface RoadDriverApplicationResponse extends CurrencyExchange{
    id: number;
    createdByName: string;
    createdById: string;
    roadId: number;
    type: RoadDriverApplicationType;
    status?: ApplicationStatusEnum;
    balanceTjs: number;
    balanceUsd: number;
    driverName: string;
    driverId: number | null;
    createdDate: string;
    updatedDate: string;
    description: string;
}