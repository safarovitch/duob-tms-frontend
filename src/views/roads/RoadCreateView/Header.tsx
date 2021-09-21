import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Breadcrumbs, Link, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const Header: React.FC = () => {
    return (
        <>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small"/>}
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
                    to="/app/roads"
                    component={RouterLink}
                >
                    Рейсы
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    Создание
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                Создание рейса
            </Typography>
        </>
    );
}

export default Header;
