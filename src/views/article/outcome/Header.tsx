import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {Article} from "../../../model/Article";

const Header: React.FC<{articleOutcome: Article}> = ({articleOutcome}) => {
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
                    to="/app/article/outcome"
                    component={RouterLink}
                >
                    Расход
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {articleOutcome ? articleOutcome.name : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {articleOutcome ? 'Изменение статьи расхода' : 'Создание статьи расхода'}
            </Typography>
        </>
    );
}

export default Header;
