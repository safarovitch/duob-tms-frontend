import React from "react";
import {CircularProgress} from "@material-ui/core";

const LoadingDeleteButton: React.FC = () => (
    <CircularProgress
        size={44}
        color='secondary'
        thickness={2}
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-22px',
            marginLeft: '-22px',
        }}
    />
)

export default LoadingDeleteButton
