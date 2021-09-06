import React, {useState} from "react";
import {logout} from "../../../store/actions/accountActions";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router";
import {IconButton, SvgIcon, Tooltip} from "@material-ui/core";
import { LogOut as LogOutIcon } from 'react-feather';
import ConfirmModal from "../../../components/ConfirmModal";

const Logout: React.FC = () => {
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();
    const history = useHistory();
    const [isOpen, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        try {
            handleClose();
            await dispatch(logout());
            history.push('/');
        } catch (error) {
            enqueueSnackbar('Unable to logout', {
                variant: 'error'
            });
        }
    };

    return (
        <>
            <Tooltip title="Выйти">
                <IconButton
                    color="inherit"
                    onClick={handleOpen}
                >
                    <SvgIcon>
                        <LogOutIcon />
                    </SvgIcon>
                </IconButton>
            </Tooltip>
            <ConfirmModal
                isOpen={isOpen}
                title="Выхода из аккаунта"
                description="Вы действительно хотите выйти из аккаунта?"
                onClose={handleClose}
                onAccept={handleLogout}
            />
        </>
    )
}

export default Logout
