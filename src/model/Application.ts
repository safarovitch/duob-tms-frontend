import React from "react";
import {Customer} from "./Customer";
import {Article} from "./Article";
import {Employee} from "./Employee";

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

export interface RefillBalanceApplication {
    id?: number;
    createdDate?: string;
    employeeName?: string;
    casherName?: string;
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
    employeeName?: string;
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
    employeeName?: string;
    employeeId?: number;
    createdBy?: string;
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

