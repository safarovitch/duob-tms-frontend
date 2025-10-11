import React from "react";
import {ArticleTabPanelProps} from "../../model/Article";

const ArticleTabPanel: React.FC<ArticleTabPanelProps> = (props: ArticleTabPanelProps) => {
    const { children, value, index, ...rest } = props;

    return (
        <div
            role="tabpanel"
            hidden={value.value !== index}
            id={`article-tabpanel-${index}`}
            aria-labelledby={`article-tab-${index}`}
            {...rest}
        >
            {value.value === index && (
                <>{children}</>
            )}
        </div>
    );
}

export default ArticleTabPanel;
