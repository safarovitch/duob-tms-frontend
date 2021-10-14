import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
    AppBar,
    Box,
    Toolbar,
    makeStyles, Typography,
} from '@material-ui/core';
import Logo from '../../../components/Logo';
import { THEMES } from '../../../constants';
import Profile from './Profile';
import Settings from './Settings';
import {useSelector} from "react-redux";
import {User} from "../../../model/User";

const useStyles = makeStyles((theme?: any) => ({
    root: {
        zIndex: theme.zIndex.drawer + 100,
        ...theme.name === THEMES.LIGHT ? {
            boxShadow: 'none',
            backgroundColor: theme.palette.primary.main
        } : {},
        ...theme.name === THEMES.ONE_DARK ? {
            backgroundColor: theme.palette.background.default
        } : {}
    },
    toolbar: {
        minHeight: 64
    },
    balanceTitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 13
    },
    balance: {
        fontSize: 18
    }
}));

const TopBar: React.FC<{className?: string}> = ({className, ...rest}) => {
    const classes = useStyles();
    const user = useSelector(({user}: { user: User }) => user);

    return (
        <AppBar
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Toolbar className={classes.toolbar}>
                <RouterLink to="/">
                    <Logo />
                </RouterLink>
                <Box ml={2} flexGrow={1}/>
                <Box>
                    <Typography variant="body1" className={classes.balanceTitle}>
                        Текущий баланс
                    </Typography>
                    <Typography variant="body1" align="right" className={classes.balance}>
                        {user.balance} $
                    </Typography>
                </Box>
                <Box ml={2}>
                    <Profile />
                </Box>
                <Settings />
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
