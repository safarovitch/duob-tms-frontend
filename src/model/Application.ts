import React from "react";
import {Customer} from "./Customer";
import {Article} from "./Article";
import {Employee} from "./Employee";
import {Warehouse} from "./Warehouse";
import {CurrencyExchangeRequest, Exchange} from "./Exchange";
import {RoadDriverApplicationMoneyUnit, RoadDriverApplicationType} from "../constants";

type StatusApplication = 'WAITING' | 'PAID' | 'ON_ROAD';

export interface ApplicationStuffTab {
    value: string;
    label: string;
}

export interface ApplicationTabPanelProps {
    index: string;
    value: string;
    children?: React.ReactNode;
}

interface CreatedBy {
    id: number;
    name: string;
}

export type RefillBalanceTypeAction = 'REFILL' | 'RETURN';

export interface RefillBalanceApplication extends CurrencyExchangeRequest {
    id?: number;
    createdDate?: string;
    createdBy?: CreatedBy;
    cashierName?: string;
    client?: Customer;
    clientId: number;
    actionType: RefillBalanceTypeAction;
    status?: StatusApplication;
    images?: string;
    description: string;
    updatedDate?: string;
}

export interface RefillBalanceFormProps {
    refillBalance: RefillBalanceApplication;
    customers: Customer[];
    exchanges: Exchange[];
}

export interface IncomeByArticleApplication extends CurrencyExchangeRequest {
    id?: number;
    createdBy?: CreatedBy;
    cashierName?: string;
    article?: Article,
    articleId: number;
    status?: StatusApplication;
    images?: string;
    description: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface IncomeByArticleFormProps {
    incomeArticle: IncomeByArticleApplication;
    articles: Article[];
}

export interface OutcomeByArticleApplication extends CurrencyExchangeRequest {
    id?: number;
    createdBy?: CreatedBy;
    employee?: Employee;
    employeeId?: number;
    cashierName?: string;
    adminApproval?: boolean;
    article?: Article;
    articleId?: number;
    status?: StatusApplication;
    images?: string;
    description: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface OutcomeByArticleFormProps {
    articles: Article[];
    employees: Employee[];
    exchanges: Exchange[];
}

export interface OutcomeTransferWarehouseApplication extends CurrencyExchangeRequest {
    id?: number;
    createdBy?: CreatedBy;
    toWarehouseId?: number;
    toWarehouse?: Warehouse;
    fromCashier?: {
        id: number;
        name: string;
    };
    toCashierName?: string;
    adminApproval?: boolean;
    status?: StatusApplication;
    images?: string;
    description: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface OutcomeTransferWarehouseFormProps {
    warehouses: Warehouse[];
    exchanges: Exchange[];
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
    actualMoneyUnit: RoadDriverApplicationMoneyUnit;
    balanceTjs: number;
    balanceUsd: number;
    description: string;
}

export interface RoadDriverApplicationResponse {
    id: number;
    createdByName: string;
    createdById: string;
    roadId: number;
    type: RoadDriverApplicationType;
    status?: StatusApplication;
    balanceTjs: number;
    balanceUsd: number;
    driverName: string;
    driverId: number | null;
    actualAmount: number;
    actualMoneyUnit: RoadDriverApplicationMoneyUnit;
    createdDate: string;
    updatedDate: string;
    description: string;
}