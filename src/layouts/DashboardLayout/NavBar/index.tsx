import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Avatar,
    Box,
    Divider,
    Drawer,
    Hidden,
    Link,
    List,
    ListSubheader,
    Typography,
    makeStyles
} from '@material-ui/core';
import {
    ShoppingCart as ShoppingCartIcon,
    Folder as FolderIcon,
    BarChart as BarChartIcon,
    PieChart as PieChartIcon,
    Users as UsersIcon,
    Settings as SettingsIcon
} from 'react-feather';
import Logo from '../../../components/Logo';
import NavItem from './NavItem';
import {useSelector} from "react-redux";
import {User} from "../../../model/User";
import {EMPLOYEES_IMAGE_BASE_URL} from "../../../config";
import {mapOfRoles} from "../../../constants";
import usePermission from "../../../hooks/usePermission";
import PERMISSIONS from "../../../constants/permissions";

const navConfig = [
    {
        subheader: 'Другое',
        items: [
            {
                title: 'Оформить заказ',
                icon: PieChartIcon,
                href: '/app/reports/dashboard'
            },
            {
                title: 'Другое',
                icon: BarChartIcon,
                href: '/app/reports/dashboard-alternative'
            }
        ]
    },
    {
        subheader: 'Настройки',
        items: [
            {
                title: 'Склады',
                icon: SettingsIcon,
                href: '/app/warehouses',
                perm: PERMISSIONS.WAREHOUSE.LIST
            },
            {
                title: 'Сотрудники',
                icon: UsersIcon,
                href: '/app/employees',
                perm: PERMISSIONS.EMPLOYEE.LIST
            },
            {
                title: 'Поставщики',
                icon: ShoppingCartIcon,
                href: '/app/providers',
                perm: PERMISSIONS.PROVIDER.LIST
            },
            {
                title: 'Клиенты',
                icon: FolderIcon,
                href: '/app/customers',
                perm: PERMISSIONS.CUSTOMER.LIST
            },
            {
                title: 'Константы груза',
                icon: FolderIcon,
                href: '/app/cargo',
                perm: PERMISSIONS.CARGO.LIST
            },
            {
                title: 'Константы рейса',
                icon: FolderIcon,
                href: '/app/cargo',
                perm: PERMISSIONS.CARGO.LIST
            }
        ]
    }
];

const renderNavItems = ({ items, ...rest }: any) => {
    return (
        <List disablePadding>
            {items.reduce(
                (acc: any, item: any) => reduceChildRoutes({ acc, item, ...rest }),
                []
            )}
        </List>
    );
}

function reduceChildRoutes({
                               acc,
                               pathname,
                               item,
                               depth = 0
                           }: any) {
    const key = item.title + depth;

    if (item.items) {
        const open = matchPath(pathname, {
            path: item.href,
            exact: false
        });

        acc.push(
            <NavItem
                depth={depth}
                icon={item.icon}
                key={key}
                info={item.info}
                open={Boolean(open)}
                title={item.title}
            >
                {renderNavItems({
                    depth: depth + 1,
                    pathname,
                    items: item.items
                })}
            </NavItem>
        );
    } else {
        acc.push(
            <NavItem
                depth={depth}
                href={item.href}
                icon={item.icon}
                key={key}
                info={item.info}
                title={item.title}
            />
        );
    }

    return acc;
}

const useStyles = makeStyles(() => ({
    mobileDrawer: {
        width: 256
    },
    desktopDrawer: {
        width: 256,
        top: 64,
        height: 'calc(100% - 64px)'
    },
    avatar: {
        cursor: 'pointer',
        width: 64,
        height: 64
    }
}));

const filterNavConfig = (items: any) => {
    return items.filter((item: any) => {
        if (item.perm) return usePermission(item.perm)
        else return true
    })
}

const NavBar: React.FC<{openMobile: boolean, onMobileClose: () => void}> = ({ openMobile, onMobileClose, }) => {
    const classes = useStyles();
    const location = useLocation();
    const user = useSelector((state: {user: User}) => state.user);

    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose();
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    const content = (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <PerfectScrollbar options={{ suppressScrollX: true }}>
                <Hidden lgUp>
                    <Box
                        p={2}
                        display="flex"
                        justifyContent="center"
                    >
                        <RouterLink to="/">
                            <Logo />
                        </RouterLink>
                    </Box>
                </Hidden>
                <Box p={2}>
                    <Box
                        display="flex"
                        justifyContent="center"
                    >
                        <RouterLink to="/app/profile">
                            <Avatar
                                className={classes.avatar}
                                src={user.avatar ? EMPLOYEES_IMAGE_BASE_URL + user.avatar: undefined}
                            />
                        </RouterLink>
                    </Box>
                    <Box
                        mt={2}
                        textAlign="center"
                    >
                        <Link
                            component={RouterLink}
                            to="/app/profile"
                            variant="h5"
                            color="textPrimary"
                            underline="none"
                        >
                            {user.name}
                        </Link>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                        >
                            {user.roles.map(r => mapOfRoles.get(r)).join(', ')}
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <Box p={2}>
                    {navConfig.map((config) => (
                        <List
                            key={config.subheader}
                            subheader={(
                                <ListSubheader
                                    disableGutters
                                    disableSticky
                                >
                                    {config.subheader}
                                </ListSubheader>
                            )}
                        >
                            {renderNavItems({ items: filterNavConfig(config.items), pathname: location.pathname })}
                        </List>
                    ))}
                </Box>
            </PerfectScrollbar>
        </Box>
    );

    return (
        <>
            <Hidden lgUp>
                <Drawer
                    anchor="left"
                    classes={{ paper: classes.mobileDrawer }}
                    onClose={onMobileClose}
                    open={openMobile}
                    variant="temporary"
                >
                    {content}
                </Drawer>
            </Hidden>
            <Hidden mdDown>
                <Drawer
                    anchor="left"
                    classes={{ paper: classes.desktopDrawer }}
                    open
                    variant="persistent"
                >
                    {content}
                </Drawer>
            </Hidden>
        </>
    );
}

export default NavBar;
