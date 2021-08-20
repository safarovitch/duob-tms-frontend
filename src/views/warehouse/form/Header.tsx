import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import {
    Breadcrumbs,
    Link,
    Typography,
    makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Warehouse} from "../../../model/Warehouse";

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: React.FC<{className?: string, warehouse?: Warehouse}> = ({ className,warehouse }) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, className)}
        >
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                <Link
                    variant="body1"
                    color="inherit"
                    to="/app"
                    component={RouterLink}
                >
                    Главная
                </Link>
                <Link
                    variant="body1"
                    color="inherit"
                    to="/app/warehouses"
                    component={RouterLink}
                >
                    Склады
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {warehouse ? warehouse.name : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {warehouse ? 'Изменение склада':'Создание склада'}
            </Typography>
        </div>
    );
}

export default Header;
