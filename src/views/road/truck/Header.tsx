import {Breadcrumbs, Link, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import clsx from "clsx";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {Truck} from "../../../model/Road";

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: React.FC<{className?: string, truck: Truck}> = ({ className, truck }) => {
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
                    {truck ? truck.id : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {truck ? 'Изменение машины' : 'Создание машины'}
            </Typography>
        </div>
    );
}

export default Header;
