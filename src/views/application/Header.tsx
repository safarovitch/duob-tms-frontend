import {Breadcrumbs, Button, Grid, Link, makeStyles, MenuItem, SvgIcon, TextField, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {NavLink as RouterLink} from "react-router-dom";
import {PlusCircle as PlusCircleIcon} from "react-feather";
import usePermission from "../../hooks/usePermission";
import PERMISSIONS from "../../constants/permissions";
import {Warehouse} from "../../model/Warehouse";

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
    },
    queryField: {
        width: 250
    },
}));

interface HeaderProps {
    title: string;
    linkName: string;
    warehouses: Warehouse[];
    warehouseId?: number;
    setWarehouseId: Function;
}

const Header: React.FC<HeaderProps> = (props) => {
    const {title, linkName, warehouses, warehouseId, setWarehouseId} = props
    const classes = useStyles()
    const canCreateRefillBalance = usePermission(PERMISSIONS.APPLICATION.REFILL_BALANCE.CREATE)
    const canCreateIncomeArticle = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.CREATE)
    const canCreateOutcomeArticle = usePermission(PERMISSIONS.APPLICATION.OUTCOME_ARTICLE.CREATE)
    const canCreateOutcomeTransferWarehouse = usePermission(PERMISSIONS.APPLICATION.OUTCOME_TRANSFER_WAREHOUSE.CREATE)
    const canCreateRoadDriver = usePermission(PERMISSIONS.APPLICATION.ROAD_DRIVER.CREATE)

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
            case "outcome-transfer-warehouse": {
                return canCreateOutcomeTransferWarehouse
            }
            case "road-driver": {
                return canCreateRoadDriver
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
            {
                warehouses.length > 0 && (
                    <Grid item>
                        <TextField
                            className={classes.queryField}
                            onChange={(event) => {
                                event.persist()
                                setWarehouseId(Number(event.target.value))
                            }}
                            value={warehouseId || ''}
                            size="small"
                            select
                            fullWidth
                            label="Выберите склад"
                            color="secondary"
                            variant="outlined"
                            SelectProps={{
                                MenuProps: {
                                    variant: "selectedMenu",
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                    },
                                    getContentAnchorEl: null
                                }
                            }}
                        >
                            {warehouses.map((warehouse) => (
                                <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                )
            }
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
