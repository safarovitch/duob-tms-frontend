import {Breadcrumbs, Button, Grid, Link, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {NavLink as RouterLink} from "react-router-dom";
import {PlusCircle as PlusCircleIcon} from "react-feather";
import usePermission from "../../hooks/usePermission";
import PERMISSIONS from "../../constants/permissions";

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

const Header: React.FC<{ title: string, linkName: string }> = ({title, linkName}) => {
    const classes = useStyles();
    const canCreateRefillBalance = usePermission(PERMISSIONS.APPLICATION.REFILL_BALANCE.CREATE)
    const canCreateIncomeArticle = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.CREATE)
    const canCreateOutcomeArticle = usePermission(PERMISSIONS.APPLICATION.OUTCOME_ARTICLE.CREATE)

    const canCreate = (): boolean => {
        switch (linkName) {
            case "refill-balance": {
                return canCreateRefillBalance
            }
            case "income-article": {
                return canCreateIncomeArticle
            }
            case "outcome-article": {
                return canCreateOutcomeArticle
            }
            default: return false
        }
    }

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
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        Заявки
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    {title}
                </Typography>
            </Grid>
            {canCreate() && (
                <Grid item>
                    <Button
                        color="secondary"
                        variant="contained"
                        component={RouterLink}
                        to={`/app/application/${linkName}/create`}
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
            )}
        </Grid>
    );
}

export default Header;
