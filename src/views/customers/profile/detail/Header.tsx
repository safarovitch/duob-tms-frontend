import {Breadcrumbs, Button, Grid, Link, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {NavLink as RouterLink} from "react-router-dom";
import {useParams} from "react-router";
import {PlusCircle as PlusCircleIcon} from "react-feather";

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

const Header: React.FC<{customerName: string}> = ({ customerName}) => {
    const classes = useStyles();
    const {stuffId, id} = useParams<{stuffId: string, id: string}>()

    console.log(stuffId)

    return (
        <Grid
            className={classes.root}
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
            {
                stuffId === "credits" && (
                    <Grid item>
                        <Button
                            color="secondary"
                            variant="contained"
                            to={`/app/customers/${id}/credits/create`}
                            component={RouterLink}
                            className={classes.action}
                        >
                            <SvgIcon
                                fontSize="small"
                                className={classes.actionIcon}
                            >
                                <PlusCircleIcon />
                            </SvgIcon>
                            Добавить
                        </Button>
                    </Grid>
                )
            }
        </Grid>
    );
}

export default Header;
