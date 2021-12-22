import {Button, Grid, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import React from "react";
import {useHistory} from "react-router-dom";
import {ArrowLeft as PlusCircleIcon} from "react-feather";
import {WarehouseStateCargo} from "../../../model/Warehouse";

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

const Header: React.FC<{cargo: WarehouseStateCargo}> = ({cargo}) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <Grid
            container
            justifyContent="space-between"
            spacing={3}
        >
            <Grid item>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    {cargo.productName}
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
    );
}

export default Header;
