import React, {forwardRef} from 'react';
import { Helmet } from 'react-helmet';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
    }
}))

const Page = forwardRef<HTMLDivElement, {[key: string]: any}>(({title, children, ...rest}, ref) => {
    const classes = useStyles();

    return (
        <div
            className={classes.root}
            ref={ref}
            {...rest}
        >
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {children}
        </div>
    );
});

export default Page;
