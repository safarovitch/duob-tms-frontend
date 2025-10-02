import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
    makeStyles,
    CircularProgress
} from '@material-ui/core';
import {useSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {User} from "../../../../../model/User";
import {mapOfRoles} from "../../../../../constants";
import errorMessageHandler from "../../../../../utils/errorMessageHandler";
import {updateProfile} from "../../../../../store/actions/accountActions";
import customerService from "../../../../../services/CustomerService";
import {CUSTOMERS_IMAGE_BASE_URL} from "../../../../../config";

const useStyles = makeStyles((theme) => ({
    root: {},
    name: {
        marginTop: theme.spacing(1)
    },
    avatar: {
        height: 100,
        width: 100,
        cursor: "pointer"
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    fabProgress: {
        color: '#5850EC',
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
}));

const ProfileDetails: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const user = useSelector((state: {user: User}) => state.user);
    const [currentFile, setCurrentFile] = useState<File>()
    const [selectedAvatar, setSelectedAvatar] = useState<string>()
    const [loading, setLoading] = useState(false)
    const pathToAvatar = user.avatar ? CUSTOMERS_IMAGE_BASE_URL + user.avatar : undefined

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const target = event.target as HTMLInputElement;
        const file = (target.files!)[0];

        if (file === undefined) return;

        setCurrentFile(file)
        setSelectedAvatar(URL.createObjectURL(file))
        event.target.value = '';
    }

    const resetFile = () => {
        setCurrentFile(undefined)
        setSelectedAvatar(undefined)
    }

    const handleDeleteAvatar = async () => {
        setLoading(true);
        try {
            await customerService.deleteAvatar(user.avatar!);

            enqueueSnackbar('Изображения удален', {variant: 'success'})
            user.avatar = null
            dispatch(updateProfile(user))
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false);
        }
    }

    const handleUpload = () => {
        uploadAvatar().then(null);
    }

    const uploadAvatar = async () => {
        setLoading(true);

        try {
            if (user.avatar) await customerService.deleteAvatar(user.avatar);

            const avatar: any = await customerService.uploadAvatar(currentFile!)

            resetFile()
            user.avatar = avatar.data.name;
            dispatch(updateProfile(user))
            enqueueSnackbar('Изображения добавлен', {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    textAlign="center"
                >
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <label htmlFor="file">
                                <Avatar
                                    className={classes.avatar}
                                    src={selectedAvatar ? selectedAvatar : pathToAvatar}
                                />
                            </label>
                            <input accept="image/*" id="file" type="file" onChange={selectFile} hidden={true} />
                            {loading && <CircularProgress size={110} className={classes.fabProgress} />}
                        </div>
                    </div>
                    <Typography
                        className={classes.name}
                        gutterBottom
                        variant="h3"
                        color="textPrimary"
                    >
                        {user.name}
                    </Typography>
                    <Typography
                        color="textPrimary"
                        variant="body1"
                    >
                        {user.roles.map(r => mapOfRoles.get(r)).join(', ')}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                {selectedAvatar ? (
                    <>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={resetFile}
                        >
                            Отмена
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={handleUpload}
                        >
                            Сохранить
                        </Button>
                    </>
                ) : (
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={handleDeleteAvatar}
                        disabled={!user.avatar}
                    >
                        Удалить изображение
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

export default ProfileDetails;
