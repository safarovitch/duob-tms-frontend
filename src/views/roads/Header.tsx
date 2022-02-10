import {Breadcrumbs, Grid, Link, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {NavLink as RouterLink} from "react-router-dom";
import CompleteRoadButton from "./CompleteRoadButton";
import {RoadStatusEnum} from "../../constants";
import ArrivedRoadButton from "./ArrivedRoadButton";

const Header: React.FC<{id: string, title: string, roadStatus: RoadStatusEnum, updateRoad: Function}> = ({id, title, roadStatus, updateRoad}) => {
    return (
        <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
        >
            <Grid item>
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
            <Grid item>
                <Grid container spacing={2}>
                    <Grid item>
                        <ArrivedRoadButton status={roadStatus} roadId={Number(id)} updateRoad={updateRoad} />
                    </Grid>
                    <Grid item>
                        <CompleteRoadButton status={roadStatus} roadId={Number(id)} updateRoad={updateRoad} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Header;
