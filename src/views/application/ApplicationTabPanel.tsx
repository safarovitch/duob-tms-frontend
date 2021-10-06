import React from "react";
import {ApplicationTabPanelProps} from "../../model/Application";

const RoadsTabPanel: React.FC<ApplicationTabPanelProps> = ({index, value, children }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`application-tabpanel-${index}`}
            aria-labelledby={`application-tab-${index}`}
        >
            {value === index && (
                <>{children}</>
            )}
        </div>
    );
}

export default RoadsTabPanel;
