import {Breadcrumbs, Link, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import clsx from "clsx";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {CargoType} from "../../../model/Cargo";

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: React.FC<{className?: string, cargoType: CargoType}> = ({ className, cargoType }) => {
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
                    to="/app/cargo"
                    component={RouterLink}
                >
                    Константы груза
                </Link>
                <Link
                    variant="body1"
                    color="inherit"
                    to="/app/cargo/type"
                    component={RouterLink}
                >
                    Виды груза
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {cargoType ? cargoType?.name : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {cargoType ? 'Изменение вида груза' : 'Создание вида груза'}
            </Typography>
        </div>
    );
}

export default Header;
