import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import React from "react";

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
            <Link
                variant="body1"
                color="inherit"
                to="/app/notifications"
                component={RouterLink}
            >
                Уведомление
            </Link>
            <Typography
                variant="body1"
                color="textPrimary"
            >
                Создание уведомления
            </Typography>
        </Breadcrumbs>
        <Typography
            variant="h3"
            color="textPrimary"
        >
            Создание уведомления
        </Typography>
    </>
)

export default Header