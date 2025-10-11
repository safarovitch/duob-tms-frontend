import React from "react";
import {CargoTabPanelProps} from "../../model/Cargo";

const CargoTabPanel: React.FC<CargoTabPanelProps> = (props: CargoTabPanelProps) => {
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
