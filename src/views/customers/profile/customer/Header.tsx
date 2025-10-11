import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Typography,
    Breadcrumbs,
    Link,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const Header: React.FC = () => {
    return (
        <div>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                <Link color="inherit" to="/" component={RouterLink}>
                    Главная
                </Link>
                <Typography color="textPrimary">
                    Профиль
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                Настройки
            </Typography>
        </div>
    );
}

export default Header;
