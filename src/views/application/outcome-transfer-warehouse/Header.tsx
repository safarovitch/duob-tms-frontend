import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";

const Header: React.FC = () => {
    return (
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
                    to="/app/application"
                    component={RouterLink}
                >
                    Заявки
                </Link>
                <Link
                    variant="body1"
                    color="inherit"
                    to="/app/application/outcome-transfer-warehouse"
                    component={RouterLink}
                >
                    Перевод денег
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
                Перевод денег
            </Typography>
        </>
    );
}

export default Header;
