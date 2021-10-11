import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {RefillBalanceApplication} from "../../../model/Application";

const Header: React.FC<{refillBalance: RefillBalanceApplication}> = ({refillBalance}) => {
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
                    to="/app/application/refill-balance"
                    component={RouterLink}
                >
                    Пополнение баланса
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {refillBalance ? refillBalance?.client?.name : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {refillBalance ? 'Изменение пополнение баланса' : 'Пополнение баланса'}
            </Typography>
        </>
    );
}

export default Header;
