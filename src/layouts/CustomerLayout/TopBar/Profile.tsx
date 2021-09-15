import React, {useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {useHistory} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from 'notistack';
import {Avatar, Box, makeStyles, Menu, MenuItem, IconButton} from '@material-ui/core';
import {logout} from '../../../store/actions/accountActions';
import {User} from "../../../model/User";
import ConfirmModal from "../../../components/ConfirmModal";

const useStyles = makeStyles(() => ({
    avatar: {
        height: 42,
        width: 42,
    },
    popover: {
        width: 200
    }
}));

function Profile() {
    const classes = useStyles();
    const history = useHistory();
    const ref = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const user = useSelector(({user}: { user: User }) => user);
    const {enqueueSnackbar} = useSnackbar();
    const [isOpen, setOpen] = useState(false);
    const [isOpenModal, setOpenModal] = useState(false);

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
        } catch (error: any) {
            enqueueSnackbar('Unable to logout', {
                variant: 'error'
            });
        }
    };

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                component={IconButton}
                onClick={handleOpen}
                {...{ ref: ref } as any}
            >
                <Avatar
                    className={classes.avatar}
                    src={user.avatar ? user.avatar : undefined}
                />
            </Box>
            <Menu
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                keepMounted
                PaperProps={{className: classes.popover}}
                getContentAnchorEl={null}
                anchorEl={ref.current}
                open={isOpen}
            >
                <MenuItem
                    component={RouterLink}
                    to="/customer/profile"
                    onClick={handleClose}
                >
                    Профиль
                </MenuItem>
                <MenuItem onClick={() => setOpenModal(true)}>
                    Выход
                </MenuItem>
            </Menu>
            <ConfirmModal
                isOpen={isOpenModal}
                title="Выхода из аккаунта"
                description="Вы действительно хотите выйти из аккаунта?"
                onClose={() => {setOpenModal(false); setOpen(false)}}
                onAccept={handleLogout}
            />
        </>
    );
}

export default Profile;
