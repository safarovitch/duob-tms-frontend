import React from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import clsx from 'clsx';
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
import {
    PlusCircle as PlusCircleIcon,
} from 'react-feather';
import {WarehouseListHeaderProps} from "../../model/Warehouse";

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

const Header: React.FC<WarehouseListHeaderProps> = ({ className }) => {
    const classes = useStyles();
    const history = useHistory();

    const onCreateNewCustomer = () => {
        history?.push("/app/warehouses/create")
    }
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
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        Склады
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    Все Склады
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onCreateNewCustomer}
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
        </Grid>
    );
}

export default Header;
