import React from "react";
import {RoadTabPanelProps} from "../../model/Road";

const RoadsTabPanel: React.FC<RoadTabPanelProps> = (props: RoadTabPanelProps) => {
    const { children, value, index, ...rest } = props;

    return (
        <div
            role="tabpanel"
            hidden={value.value !== index}
            id={`road-tabpanel-${index}`}
            aria-labelledby={`road-tab-${index}`}
            {...rest}
        >
            {value.value === index && (
                <>{children}</>
            )}
        </div>
    );
}

export default RoadsTabPanel;
