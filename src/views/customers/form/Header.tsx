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
import {Customer} from "../../../model/Customer";

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: React.FC<{className?: string, customer?: Customer}> = ({ className,customer }) => {
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
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {customer ? customer.name : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {customer ? 'Редактирование клиента':'Создание клиента'}
            </Typography>
        </div>
    );
}

export default Header;
