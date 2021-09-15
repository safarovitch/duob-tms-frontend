import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
    Breadcrumbs,
    Button,
    Grid,
    Link,
    Typography,
    makeStyles,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {PlusCircle as PlusCircleIcon, MinusCircle as MinusCircleIcon, RefreshCw as RefreshCwIcon} from 'react-feather';

const useStyles = makeStyles((theme) => ({
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
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
                        АЗС
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    АЗС
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    to="/app/fuels/income"
                    component={RouterLink}
                    variant="contained"
                    color="secondary"
                    endIcon={<PlusCircleIcon />}
                    className={classes.button}
                >
                    Приход
                </Button>
                <Button
                    to="/app/fuels/transfusion"
                    component={RouterLink}
                    variant="contained"
                    color="secondary"
                    endIcon={<RefreshCwIcon size="20" />}
                    className={classes.button}
                >
                    Переливание
                </Button>
                <Button
                    to="/app/fuels/outcome"
                    component={RouterLink}
                    variant="contained"
                    color="secondary"
                    endIcon={<MinusCircleIcon />}
                    className={classes.button}
                >
                    Расход
                </Button>
            </Grid>
        </Grid>
    );
}

export default Header;
