import React, {useState} from "react";
import NavBar from './NavBar';
import TopBar from './TopBar';
import getStyles from "../getStyles";

const MainLayout: React.FC = ({ children }) => {
    const classes = getStyles();
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className={classes.root}>
            <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
            <NavBar
                onMobileClose={() => setMobileNavOpen(false)}
                openMobile={isMobileNavOpen}
            />
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

export default MainLayout;
