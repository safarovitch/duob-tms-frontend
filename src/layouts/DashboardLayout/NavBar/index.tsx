import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {DollarSign as DollarIcon, CheckSquare as CheckSquareIcon, Box as BoxIcon, Sliders as SlidersIcon,
    Tool as ToolIcon} from 'react-feather';
import {Avatar, Box, Divider, Drawer, Hidden, Link, List, ListSubheader, Typography, makeStyles} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import LocalShippingIcon from '@material-ui/icons/LocalShippingOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import ImportContactsIcon from '@material-ui/icons/ImportContactsOutlined';
import TrainIcon from '@material-ui/icons/TrainOutlined';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStationOutlined';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
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
        subheader: 'Рейс',
        items: [
            {
                title: 'Рейсы',
                icon: TrainIcon,
                href: '/app/roads',
                perm: PERMISSIONS.ROAD.LIST
            },
            {
                title: 'Константы рейса',
                icon: ToolIcon,
                href: '/app/road',
                perm: PERMISSIONS.ROAD.LIST
            },
            {
                title: 'АЗС',
                icon: LocalGasStationIcon,
                href: '/app/fuels',
                perm: PERMISSIONS.FUEL.LIST
            },
        ]
    },
    {
        subheader: 'Касса',
        items: [
            {
                title: 'Заявки',
                icon: DescriptionIcon,
                href: '/app/application',
                perm: PERMISSIONS.APPLICATION.LIST
            },
            {
                title: 'Курс валют',
                icon: DollarIcon,
                href: '/app/exchange',
                perm: PERMISSIONS.EXCHANGE.LIST
            },
            {
                title: 'Статьи',
                icon: ImportContactsIcon,
                href: '/app/article',
                perm: PERMISSIONS.ARTICLE.LIST
            },
        ]
    },
    {
        subheader: 'Заявки',
        items: [
            {
                title: 'Выдача груза',
                icon: BoxIcon,
                href: '/app/cargo-issues',
                perm: PERMISSIONS.CARGO.ISSUES.LIST
            },
            {
                title: 'Подотчеты',
                icon: CheckSquareIcon,
                href: '/app/employee-accounts',
                perm: PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.LIST
            },
        ]
    },
    {
        subheader: 'Настройки',
        items: [
            {
                title: 'Сотрудники',
                icon: PeopleIcon,
                href: '/app/employees',
                perm: PERMISSIONS.EMPLOYEE.LIST
            },
            {
                title: 'Клиенты',
                icon: PersonIcon,
                href: '/app/customers',
                perm: PERMISSIONS.CUSTOMER.LIST
            },
            {
                title: 'Склады',
                icon: HomeIcon,
                href: '/app/warehouses',
                perm: PERMISSIONS.WAREHOUSE.LIST
            },
            {
                title: 'Поставщики',
                icon: LocalShippingIcon,
                href: '/app/providers',
                perm: PERMISSIONS.PROVIDER.LIST
            },
            {
                title: 'Константы груза',
                icon: SlidersIcon,
                href: '/app/cargo',
                perm: PERMISSIONS.CARGO.LIST
            },
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
                                src={user.avatar ? EMPLOYEES_IMAGE_BASE_URL + user.avatar : undefined}
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
                    {navConfig.map((config) => {
                        const filterItems = filterNavConfig(config.items)

                        return filterItems.length > 0 && (
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
                                {renderNavItems({ items: filterItems, pathname: location.pathname })}
                            </List>
                        )
                    })}
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
