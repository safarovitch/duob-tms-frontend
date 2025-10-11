import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {Truck} from "../../../model/Road";

const Header: React.FC<{truck: Truck}> = ({truck}) => (
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
                to="/app/road"
                component={RouterLink}
            >
                Константы рейса
            </Link>
            <Link
                variant="body1"
                color="inherit"
                to="/app/road/truck"
                component={RouterLink}
            >
                Машины
            </Link>
            <Typography
                variant="body1"
                color="textPrimary"
            >
                {truck ? truck.number : 'Создание'}
            </Typography>
        </Breadcrumbs>
        <Typography
            variant="h3"
            color="textPrimary"
        >
            {truck ? 'Изменение машины' : 'Создание машины'}
        </Typography>
    </>
);

export default Header;
