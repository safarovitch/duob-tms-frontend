import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
    Breadcrumbs,
    Link,
    Typography,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const Header: React.FC = () => (
    <>
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
            <Typography
                variant="body1"
                color="textPrimary"
            >
                Состояние складов
            </Typography>
        </Breadcrumbs>
        <Typography
            variant="h3"
            color="textPrimary"
        >
            Состояние складов
        </Typography>
    </>
);

export default React.memo(Header);
