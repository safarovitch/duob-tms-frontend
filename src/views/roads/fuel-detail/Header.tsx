import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {RoadFuelDetail} from "../../../model/Road";

const Header: React.FC<{roadId: string, currentFuelDetailLabel: string, roadFuelDetail: RoadFuelDetail}> = ({roadId, currentFuelDetailLabel, roadFuelDetail}) => (
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
                to="/app/roads"
                component={RouterLink}
            >
                Рейсы
            </Link>
            <Link
                variant="body1"
                color="inherit"
                to={`/app/roads/${roadId}`}
                component={RouterLink}
            >
                Рейс № {roadId}
            </Link>
            <Typography
                variant="body1"
                color="textPrimary"
            >
                {currentFuelDetailLabel}
            </Typography>
        </Breadcrumbs>
        <Typography
            variant="h3"
            color="textPrimary"
        >
            {roadFuelDetail ? 'Изменение' : 'Создание'}
        </Typography>
    </>
);

export default Header;
