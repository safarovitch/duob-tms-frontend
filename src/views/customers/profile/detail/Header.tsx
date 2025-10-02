import {Breadcrumbs, Grid, Link, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import clsx from "clsx";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {NavLink as RouterLink} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {},
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    }
}));

const Header: React.FC<{className?: string, customerName: string}> = ({ className, customerName}) => {
    const classes = useStyles();

    return (
        <Grid
            className={clsx(classes.root, className)}
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
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/customers"
                        component={RouterLink}
                    >
                        Клиенты
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        {customerName}
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    {customerName}
                </Typography>
            </Grid>
        </Grid>
    );
}

export default Header;
