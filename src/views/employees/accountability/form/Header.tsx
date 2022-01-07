import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {Accountability} from "../../../../model/Employee";
import {mapOfAccountabilityType} from "../../../../constants";

const Header: React.FC<{employeeId: string, accountability: Accountability}> = ({employeeId, accountability}) => (
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
                to="/app/employee-accounts"
                component={RouterLink}
            >
                Подотчеты
            </Link>
            <Link
                variant="body1"
                color="inherit"
                to={`/app/employee-accounts/${employeeId}`}
                component={RouterLink}
            >
                Сотрудник #{employeeId}
            </Link>
            <Typography
                variant="body1"
                color="textPrimary"
            >
                {accountability ? mapOfAccountabilityType.get(accountability.type) : 'Создание'}
            </Typography>
        </Breadcrumbs>
        <Typography
            variant="h3"
            color="textPrimary"
        >
            {accountability ? 'Изменение подотчета' : 'Создание подотчета'}
        </Typography>
    </>
);

export default Header;
