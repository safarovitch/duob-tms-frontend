import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
    AppBar,
    Box,
    Hidden,
    IconButton,
    Toolbar,
    makeStyles,
    SvgIcon
} from '@material-ui/core';
import { Menu as MenuIcon } from 'react-feather';
import Logo from '../../../components/Logo';
import { THEMES } from '../../../constants';
import Profile from './Profile';
// import Contacts from './Contacts';
// import Notifications from './Notifications';
// import Search from './Search';
import Settings from './Settings';

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
    }
}));

const TopBar: React.FC<{className?: string}> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <AppBar
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Toolbar className={classes.toolbar}>
                <RouterLink to="/">
                    <Logo />
                </RouterLink>
                <Box
                    ml={2}
                    flexGrow={1}
                />
                {/*<Search />*/}
                {/*<Contacts />*/}
                {/*<Notifications />*/}
                <Settings />
                <Box ml={2}>
                    <Profile />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
