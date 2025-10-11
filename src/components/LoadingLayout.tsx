import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import {CircularProgress, makeStyles, Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '250px',
    },
}));

const LoadingLayout: React.FC<{loading: boolean, hasError: boolean}> = ({loading, hasError}) => {
    const classes = useStyles();

    useEffect(() => {
        NProgress.start();

        return () => {
            NProgress.done();
        };
    }, []);

    return (
        <div className={classes.root}>
            {loading && <CircularProgress size={48} />}
            {hasError && <Typography>Произошла непредвиденная ошибка. Повторите попытку позже</Typography>}
        </div>
    );
}

export default LoadingLayout;
