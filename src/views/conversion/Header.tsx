import React from "react";
import {Breadcrumbs, Button, Grid, Link, makeStyles, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {PlusCircle as PlusCircleIcon} from "react-feather";
import hasPermission from "../../hooks/hasPermisson";
import PERMISSIONS from "../../constants/permissions";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1)
    }
}));

const Header: React.FC = () => {
    const classes = useStyles();
    const canCreate = hasPermission(PERMISSIONS.CONVERSION.CREATE)

    return (
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
                        Конвертация
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    Конвертация
                </Typography>
            </Grid>
            {canCreate && (
                <Grid item>
                    <Button
                        to="/app/conversion/create"
                        component={RouterLink}
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        endIcon={<PlusCircleIcon />}
                    >
                        Добавить
                    </Button>
                </Grid>
            )}
        </Grid>
    );
}

export default Header