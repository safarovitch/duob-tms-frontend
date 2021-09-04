import React from "react";
import {CustomerTabPanelProps} from "../../../../model/Customer";

const CargoTabPanel: React.FC<CustomerTabPanelProps> = (props: CustomerTabPanelProps) => {
    const { children, value, index, ...rest } = props;

    return (
        <div
            role="tabpanel"
            hidden={value.value !== index}
            id={`cargo-tabpanel-${index}`}
            aria-labelledby={`cargo-tab-${index}`}
            {...rest}
        >
            {value.value === index && (
                <>{children}</>
            )}
        </div>
    );
}

export default CargoTabPanel;
