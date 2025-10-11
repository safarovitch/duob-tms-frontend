import React from "react";
import {Breadcrumbs, Button, Grid, Link, makeStyles, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {PlusCircle as PlusCircleIcon} from "react-feather";
import NotificationButton from "./NotificationButton";
import notificationService from "../../services/NotificationService";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1)
    }
}));

const Header: React.FC = () => {
    const classes = useStyles();

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
                        Уведомление
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    Уведомление
                </Typography>
            </Grid>
            <Grid item>
                <NotificationButton
                    title={"Отправить уведомление клиентам?"}
                    description={"При отправление, будет повторная отправка уведомление о прибытии грузов"}
                    onSend={notificationService.getCargoArrived}
                >
                    Уведомление о прибытии грузов
                </NotificationButton>
                <NotificationButton
                    title={"Отправить уведомление клиентам?"}
                    description={"При отправление, будет повторная отправка уведомление о окончание срока хранение грузов"}
                    onSend={notificationService.getCargoExpiration}
                >
                    Уведомление о сроке хранение
                </NotificationButton>
                <Button
                    to="/app/notifications/create"
                    size="small"
                    component={RouterLink}
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    endIcon={<PlusCircleIcon />}
                >
                    Добавить
                </Button>
            </Grid>
        </Grid>
    );
}

export default Header