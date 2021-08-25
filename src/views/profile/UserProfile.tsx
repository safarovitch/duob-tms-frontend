import {Button, makeStyles} from "@material-ui/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {User} from "../../model/User";
import {logout} from "../../store/actions/accountActions";

const useStyles = makeStyles(() => ({
    root: {}
}));

function UserProfile() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector((state: {user: User}) => state.user);

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <div className={classes.root}>
            Profile is works via {user.name}

            <Button
                color="secondary"
                size="large"
                type="button"
                variant="contained"
                onClick={handleLogout}
            >
                Выход
            </Button>
        </div>
    );
}

export default UserProfile;
