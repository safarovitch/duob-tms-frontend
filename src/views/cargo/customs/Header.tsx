import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {CargoCustomCode} from "../../../model/Cargo";

const Header: React.FC<{customCode: CargoCustomCode}> = ({customCode}) => (
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
                to="/app/cargo/customs"
                component={RouterLink}
            >
                Томоженные коды
            </Link>
            <Typography
                variant="body1"
                color="textPrimary"
            >
                {customCode ? customCode?.productDto?.name : 'Создание'}
            </Typography>
        </Breadcrumbs>
        <Typography
            variant="h3"
            color="textPrimary"
        >
            {customCode ? 'Изменение томоженного кода' : 'Создание томоженного кода'}
        </Typography>
    </>
);

export default Header;
