import {Breadcrumbs, Link, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import clsx from "clsx";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {CargoTariff} from "../../../model/Cargo";

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: React.FC<{className?: string, cargoTariff: CargoTariff}> = ({ className, cargoTariff }) => {
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
                    to="/app/cargo/tariff"
                    component={RouterLink}
                >
                    Тарифы
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {cargoTariff ? cargoTariff?.name : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {cargoTariff ? 'Изменение тарифа' : 'Создание тарифа'}
            </Typography>
        </div>
    );
}

export default Header;
