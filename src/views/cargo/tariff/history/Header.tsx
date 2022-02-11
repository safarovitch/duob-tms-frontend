import React from "react";
import {CargoTariff} from "../../../../model/Cargo";
import {Breadcrumbs, Button, Grid, Link, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {ArrowLeft as PlusCircleIcon} from "react-feather";

const useStyles = makeStyles((theme) => ({
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

const Header: React.FC<{tariff: CargoTariff}> = ({tariff}) => {
    const classes = useStyles();
    const history = useHistory();

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
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/cargo"
                        component={RouterLink}
                    >
                        Константы груза
                    </Link>
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/cargo/tariff"
                        component={RouterLink}
                    >
                        Тарифы
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        {tariff.name}
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    Истороия тарифа: {tariff.name}
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    className={classes.action}
                    onClick={() => history.go(-1)}
                >
                    <SvgIcon
                        fontSize="small"
                        className={classes.actionIcon}
                    >
                        <PlusCircleIcon />
                    </SvgIcon>
                    Назад
                </Button>
            </Grid>
        </Grid>
    )

}

export default Header