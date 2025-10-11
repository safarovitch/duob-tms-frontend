import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {IncomeByArticleApplication} from "../../../model/Application";

const Header: React.FC<{incomeArticle: IncomeByArticleApplication}> = ({incomeArticle}) => {
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
                    to="/app/application/income-article"
                    component={RouterLink}
                >
                    Приход по статьям
                </Link>
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    {incomeArticle ? `№ ${incomeArticle?.id}` : 'Создание'}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {incomeArticle ? 'Изменение прихода по статьям' : 'Приход по статьям'}
            </Typography>
        </>
    );
}

export default Header;
