import {Breadcrumbs, Grid, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {NavLink as RouterLink} from "react-router-dom";

const Header: React.FC<{id: string, title: string}> = ({id, title}) => {

    return (
        <Grid>
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
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    Рейс № {id}
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                {title}
            </Typography>
        </Grid>
    );
}

export default Header;
