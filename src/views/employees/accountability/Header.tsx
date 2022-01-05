import {Breadcrumbs, Button, Grid, Link, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {NavLink as RouterLink} from "react-router-dom";
import {PlusCircle as PlusCircleIcon} from "react-feather";
import {EmployeeAccountabilityResponse} from "../../../model/Employee";
import usePermission from "../../../hooks/usePermission";
import PERMISSIONS from "../../../constants/permissions";

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

const Header: React.FC<{ employee: EmployeeAccountabilityResponse }> = ({employee}) => {
    const classes = useStyles();
    const canCreate = usePermission(PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.CREATE)

    return (
        <Grid
            className={classes.root}
            container
            justifyContent="space-between"
            spacing={3}
        >
            <Grid item>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small"/>}
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
                        to="/app/employee-accounts"
                        component={RouterLink}
                    >
                        Подотчеты
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        {employee.name}
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    {employee.name}
                </Typography>
            </Grid>
            {
                canCreate && (
                    <Grid item>
                        <Button
                            color="secondary"
                            variant="contained"
                            component={RouterLink}
                            to={`/app/employee-accounts/${employee.id}/create`}
                            className={classes.action}
                        >
                            <SvgIcon
                                fontSize="small"
                                className={classes.actionIcon}
                            >
                                <PlusCircleIcon/>
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
