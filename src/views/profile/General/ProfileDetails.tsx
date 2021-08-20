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
import {Employee} from "../../../model/Employee";
import employeeService from "../../../services/EmployeeService";
import {useSnackbar} from "notistack";
import {API_BASE_URL} from "../../../config";

const useStyles = makeStyles((theme) => ({
    root: {},
    name: {
        marginTop: theme.spacing(1)
    },
    avatar: {
        height: 100,
        width: 100
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

const ProfileDetails: React.FC<{employee: Employee, getEmployee: Function}> = ({ employee , getEmployee}) => {
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const baseUrl = `${API_BASE_URL}/employees/image/`;
    const [currentFile, setCurrentFile] = useState<File>();
    const [selectedFile, setSelectedFile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(employee.avatar ? baseUrl + employee.avatar : '')

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setSelectedFile(true);
        const target = event.target as HTMLInputElement;
        const file = (target.files!)[0];
        setCurrentFile(file)
        setAvatar(URL.createObjectURL(file));
    }

    const handleDeleteAvatar = async () => {
        await employeeService.deleteAvatar(employee.avatar!);

        enqueueSnackbar('Изображения удален', {
            variant: 'success',
            action: key => (<Button onClick={() => { closeSnackbar(key) }}>ОК</Button>)
        })

        setAvatar('');
        setCurrentFile(undefined)
        setSelectedFile(false)
    }

    const handleUploadCancel = () => {
        setAvatar(employee.avatar ? baseUrl + employee.avatar : '')
        setCurrentFile(undefined)
        setSelectedFile(false)
    }

    const handleUpload = () => {
        uploadAvatar().then(null);
    }

    const uploadAvatar = async () => {
        setLoading(true);

        try {
            if (employee.avatar) await employeeService.deleteAvatar(employee.avatar!);

            await employeeService.uploadAvatar(currentFile!)

            enqueueSnackbar('Изображения добавлен', {
                variant: 'success',
                action: key => (<Button onClick={() => { closeSnackbar(key) }}>ОК</Button>)
            })
            getEmployee();
            setCurrentFile(undefined);
            setSelectedFile(false);
        } catch (error) {
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: key => (<Button onClick={() => { closeSnackbar(key) }}>ОК</Button>)
            })
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
                                    src={avatar}
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
                        {employee.name}
                    </Typography>
                    <Typography
                        color="textPrimary"
                        variant="body1"
                    >
                        {employee.address}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                {selectedFile ? (
                    <>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={handleUploadCancel}
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
                        disabled={!avatar}
                    >
                        Удалить изображение
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

export default ProfileDetails;
