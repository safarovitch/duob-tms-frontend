import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
    Breadcrumbs,
    Button,
    Grid,
    Link,
    SvgIcon,
    Typography,
    makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {PlusCircle as PlusCircleIcon} from 'react-feather';
import hasPermission from "../../hooks/hasPermisson";
import PERMISSIONS from "../../constants/permissions";

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
                        Клиенты
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    Все клиенты
                </Typography>
            </Grid>
            {hasPermission(PERMISSIONS.CUSTOMER.CREATE) && (
                <Grid item>
                    <Button
                        color="secondary"
                        variant="contained"
                        component={RouterLink}
                        to={'/app/customers/create'}
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
            )}
        </Grid>
    );
}

export default Header;
