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

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: React.FC<{className?: string, id?: number}> = ({ className,id }) => {
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
                    to="/app/customers"
                    component={RouterLink}
                >
                    Клиенты
                </Link>
                <Link
                    variant="body1"
                    color="inherit"
                    to={`/app/customers/${id}/credits`}
                    component={RouterLink}
                >
                    Кредиты
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {'Оформление'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {'Оформление кредита'}
            </Typography>
        </div>
    );
}

export default Header;
