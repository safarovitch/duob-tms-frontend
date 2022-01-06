import React from "react";
import {makeStyles} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {CreditPaidRequest} from "../../../../../../model/Customer";

const useStyles = makeStyles((theme) => ({
    root: {},
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2),
        width: 177
    },
    buttonsWidth: {
        width: 177
    },
    checkbox: {
        display: 'flex'
    },
    checkboxLabel: {
        marginTop: 8
    }
}));

const Index: React.FC = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();

    const initialValues: CreditPaidRequest = {
        amount: 0,
    }

    return (
        <>
            Index
        </>
    )
}

export default Index