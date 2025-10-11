import React from "react";
import {Breadcrumbs, Button, Grid, Link, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {PlusCircle as PlusCircleIcon} from "react-feather";

const Header: React.FC = () => (
    <Grid
        container
        justifyContent="space-between"
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
                <Typography
                    variant="body1"
                    color="textPrimary"
                >
                    Хранение
                </Typography>
            </Breadcrumbs>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                Хранение
            </Typography>
        </Grid>
        <Grid item>
            <Button
                to="/app/storage-cost/create"
                component={RouterLink}
                variant="contained"
                color="secondary"
                startIcon={<PlusCircleIcon />}
            >
                Добавить
            </Button>
        </Grid>
    </Grid>
)

export default Header