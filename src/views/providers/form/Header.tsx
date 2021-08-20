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
import {Provider} from "../../../model/Provider";

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: React.FC<{className?: string, provider?: Provider}> = ({ className,provider }) => {
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
                    to="/app/providers"
                    component={RouterLink}
                >
                    Поставщики
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {provider ? provider.name : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {provider ? 'Изменение поставщика':'Создание поставщика'}
            </Typography>
        </div>
    );
}

export default Header;
