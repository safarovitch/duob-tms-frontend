import React, {useEffect} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
    AppBar,
    Box,
    Hidden,
    IconButton,
    Toolbar,
    makeStyles,
    SvgIcon, Typography, Grid
} from '@material-ui/core';
import { Menu as MenuIcon } from 'react-feather';
import Logo from '../../../components/Logo';
import { THEMES } from '../../../constants';
import Settings from '../../CustomerLayout/TopBar/Settings';
import Logout from "./Logout";
import {useDispatch, useSelector} from "react-redux";
import {WarehouseBalance} from "../../../model/Warehouse";
import {CASHIER} from "../../../constants/permissions/roles";
import warehouseService from "../../../services/WarehouseService";
import {setWarehouseBalance} from "../../../store/actions/warehouseActions";
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
    boxTitle: {
        marginLeft: 10,
        color: "white",
    },
    title: {
        fontSize: 17,
        lineHeight: '16px'
    },
    subtitle: {
        fontSize: 14,
        lineHeight: '16px',
    },
    balanceTitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 13
    },
    balance: {
        fontSize: 17
    }
}));

const TopBar: React.FC<{onMobileNavOpen: () => void, className?: string}> = ({
                    className,
                    onMobileNavOpen,
                    ...rest
                }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {warehouseBalance, needUpdateWarehouseBalance, user} =
        useSelector((state: {warehouseBalance: WarehouseBalance, needUpdateWarehouseBalance: number, user: User}) => state);

    useEffect(() => {
        if (user?.roles.findIndex((role: string) => role === CASHIER) > -1) {
            (async () => {
                try {
                    const warehouseBalance: any = await warehouseService.getWarehouseBalances()
                    dispatch(setWarehouseBalance(warehouseBalance))
                } catch {
                    dispatch(setWarehouseBalance({moneyBalanceUSD: 0, moneyBalanceTJS: 0, moneyBalanceRUB: 0, moneyBalanceCNY: 0}))
                }
            })()
        }
    }, [user, needUpdateWarehouseBalance, dispatch])

    return (
        <AppBar
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Toolbar className={classes.toolbar}>
                <Hidden lgUp>
                    <IconButton
                        color="inherit"
                        onClick={onMobileNavOpen}
                    >
                        <SvgIcon fontSize="small">
                            <MenuIcon />
                        </SvgIcon>
                    </IconButton>
                </Hidden>
                <Hidden mdDown>
                    <RouterLink to="/" style={{ textDecoration: 'none' }}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Logo />
                            </Grid>
                            <Grid item>
                                <Box className={classes.boxTitle}>
                                    <Typography variant="h6" className={classes.title}>
                                        DUOB
                                    </Typography>
                                    <Typography variant="h6" className={classes.subtitle}>
                                        Logistics
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </RouterLink>
                </Hidden>
                <Box
                    ml={2}
                    flexGrow={1}
                />
                {warehouseBalance && (
                    <Box mr={2}>
                        <Typography variant="body1" align="right" className={classes.balanceTitle}>
                            Текущий баланс склада
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography variant="body1" className={classes.balance}>
                                    {warehouseBalance.moneyBalanceTJS} TJS
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" align="right" className={classes.balance}>
                                    {warehouseBalance.moneyBalanceUSD} $
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" align="right" className={classes.balance}>
                                    {warehouseBalance.moneyBalanceRUB} ₽
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" align="right" className={classes.balance}>
                                    {warehouseBalance.moneyBalanceCNY} ¥
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                <Settings />
                <Logout />
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
