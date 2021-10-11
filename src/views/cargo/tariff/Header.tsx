import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {CargoTariff} from "../../../model/Cargo";

const Header: React.FC<{cargoTariff: CargoTariff}> = ({cargoTariff}) => (
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
    </>
);

export default Header;
