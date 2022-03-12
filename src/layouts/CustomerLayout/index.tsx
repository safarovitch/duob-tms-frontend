import React from "react";
import TopBar from './TopBar';
import getStyles from "../getStyles";

const CustomerLayout: React.FC = ({ children }) => {
    const classes = getStyles();

    return (
        <div className={classes.root}>
            <TopBar/>
            <div className={classes.wrapper}>
                <div className={classes.contentContainer}>
                    <div className={classes.content}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerLayout;
