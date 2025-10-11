import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {Article} from "../../../model/Article";

const Header: React.FC<{articleIncome: Article}> = ({articleIncome}) => {
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
                    to="/app/article"
                    component={RouterLink}
                >
                    Статьи
                </Link>
                <Link
                    variant="body1"
                    color="inherit"
                    to="/app/article/income"
                    component={RouterLink}
                >
                    Приход
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {articleIncome ? articleIncome.name : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {articleIncome ? 'Изменение статьи прихода' : 'Создание статьи прихода'}
            </Typography>
        </>
    );
}

export default Header;
