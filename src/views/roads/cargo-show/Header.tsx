import {Button, Grid, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import React from "react";
import {useHistory} from "react-router-dom";
import {ArrowLeft as PlusCircleIcon} from "react-feather";
import {CustomerCargo} from "../../../model/Customer";

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

const Header: React.FC<{customerCargo: CustomerCargo}> = ({customerCargo}) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
        >
            <Grid item>
                <Typography
                    variant="h2"
                    color="textPrimary"
                >
                    {customerCargo.productName}
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
