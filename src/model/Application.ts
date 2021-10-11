import React from "react";
import {Customer} from "./Customer";
import {Article} from "./Article";
import {Employee} from "./Employee";
import {Warehouse} from "./Warehouse";

export interface ApplicationStuffTab {
    value: string;
    label: string;
}

export interface ApplicationTabPanelProps {
    index: string;
    value: string;
    children?: React.ReactNode;
}

type StatusApplication = 'WAITING' | 'PAID';
type MoneyUnitApplication = 'TJS' | 'RUB' | 'USD' | 'CNY';
type RefillBalanceTypeAction = 'REFILL' | 'RETURN';

interface CreatedBy {
    id: number;
    name: string;
}

export interface RefillBalanceApplication {
    id?: number;
    createdDate?: string;
    createdBy?: CreatedBy;
    cashierName?: string;
    client?: Customer;
    clientId: number;
    actionType: RefillBalanceTypeAction;
    amount: number;
    moneyUnit: MoneyUnitApplication;
    currency: number;
    totalUSD: number;
    status?: StatusApplication;
    images?: string;
    description: string;
    updatedDate?: string;
}

export interface RefillBalanceFormProps {
    refillBalance: RefillBalanceApplication;
    customers: Customer[];
}

export interface IncomeByArticleApplication {
    id?: number;
    createdBy?: CreatedBy;
    cashierName?: string;
    article?: Article,
    articleId: number;
    amount: number;
    moneyUnit: MoneyUnitApplication;
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

export interface OutcomeByArticleApplication {
    id?: number;
    createdBy?: CreatedBy;
    employee?: Employee;
    employeeId?: number;
    cashierName?: string;
    adminApproval?: boolean;
    articleName?: string;
    articleId?: number;
    amount: number;
    moneyUnit?: MoneyUnitApplication;
    status?: StatusApplication;
    images?: string;
    description: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface OutcomeByArticleFormProps {
    articles: Article[];
    employees: Employee[];
}

export interface OutcomeTransferWarehouseApplication {
    id?: number;
    createdBy?: CreatedBy;
    toWarehouseId?: number;
    toWarehouse?: Warehouse;
    fromCashierName?: string;
    toCashierName?: string;
    adminApproval?: boolean;
    amount: number;
    moneyUnit?: MoneyUnitApplication;
    status?: StatusApplication;
    images?: string;
    description: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface OutcomeTransferWarehouseFormProps {
    warehouses: Warehouse[];
}

