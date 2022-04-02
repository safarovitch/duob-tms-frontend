import {Breadcrumbs, Button, Grid, Link, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {NavLink as RouterLink} from "react-router-dom";
import {useParams} from "react-router";
import {PlusCircle as PlusCircleIcon} from "react-feather";
import {Customer} from "../../../../model/Customer";
import {Currency} from "../../../../constants";
import hasPermission from "../../../../hooks/hasPermisson";
import PERMISSIONS from "../../../../constants/permissions";

const useStyles = makeStyles((theme) => ({
    root: {},
    action: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(0.5),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
    balanceTitle: {
        fontSize: 13
    },
    balance: {
        fontSize: 17
    }
}));

const Header: React.FC<{ customer: Customer }> = ({customer}) => {
    const classes = useStyles();
    const {stuffId, id} = useParams<{ stuffId: string, id: string }>()
    const canCreateCredit = hasPermission(PERMISSIONS.CUSTOMER.CREDIT.CREATE)

    return (
        <Grid
            className={classes.root}
            container
            justifyContent="space-between"
            spacing={2}
        >
            <Grid item md={8}>
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
                        to="/app/customers"
                        component={RouterLink}
                    >
                        Клиенты
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        {customer.code}
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    {customer.code}
                </Typography>
            </Grid>
            {
                stuffId === "credits" && (
                    <>
                        <Grid item md={2}>
                            <Typography variant="body1" align="right" className={classes.balanceTitle}>
                                Сумма кредита
                            </Typography>
                            <Grid item>
                                <Typography variant="body1" align="right" className={classes.balance}>
                                    {customer.creditBalance} {Currency.USD}
                                </Typography>
                            </Grid>
                        </Grid>
                        {
                            canCreateCredit && (
                                <Grid item md={2}>
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
                                            <PlusCircleIcon/>
                                        </SvgIcon>
                                        Добавить
                                    </Button>
                                </Grid>
                            )
                        }
                    </>
                )
            }
        </Grid>
    );
}

export default Header;
