import React, {useState} from "react";
import {logout} from "../../../store/actions/accountActions";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {IconButton, SvgIcon, Tooltip} from "@material-ui/core";
import { LogOut as LogOutIcon } from 'react-feather';
import ConfirmModal from "../../../components/ConfirmModal";

const Logout: React.FC = () => {
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();
    const [isOpen, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            setOpen(false)
            await dispatch(logout())
            window.location.pathname = '/'
        } catch (error: any) {
            enqueueSnackbar('Unable to logout', {variant: 'error'})
        }
    };

    return (
        <>
            <Tooltip title="Выйти">
                <IconButton
                    color="inherit"
                    onClick={() => setOpen(true)}
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
                onClose={() => setOpen(false)}
                onAccept={handleLogout}
            />
        </>
    )
}

export default Logout
