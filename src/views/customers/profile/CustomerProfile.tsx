import {Button, makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {Customer} from "../../../model/Customer";
import {deleteSelectedCustomer} from "../../../store/actions/customerActions";
import customerService from "../../../services/CustomerService";
import {useParams} from "react-router";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {}
}));

function CustomerProfile() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams<{ id: string }>();
    const customer = useSelector((state: {selectedCustomer: Customer}) => state.selectedCustomer);
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();

    const handleDeleteCustomer = async () => {
        try {
            await customerService.deleteCustomer(id);

            enqueueSnackbar('Клиент удален', {
                variant: 'success',
                action: <Button onClick={() => history.push('/app/customers')}>Клиенты</Button>
            })
            history.push('/app/customers');
        } catch (error) {
            enqueueSnackbar('Что-то пошло не так. Попробуйте снова.', {
                variant: 'error',
                action: <Button onClick={() => history.push('/app/customers')}>Клиенты</Button>
            })
        }
    }

    useEffect(() => () => {dispatch(deleteSelectedCustomer())}, [])

    return (
        <div className={classes.root}>
            Profile is works via {customer.name}

            <Button
                color="secondary"
                size="large"
                type="button"
                variant="contained"
                onClick={handleDeleteCustomer}
            >
                Удалить
            </Button>
        </div>
    );
}

export default CustomerProfile;
