import React from "react";

export interface ArticleStuffTab {
    value: string;
    label: string;
}

export interface ArticleTabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: ArticleStuffTab;
}

export interface Article {
    id?: number;
    name: string;
}
