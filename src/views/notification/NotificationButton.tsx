import React, {useState} from "react";
import {
    Box, Button, CircularProgress, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
    Typography
} from "@material-ui/core";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: 16
    },
    button: {
        margin: theme.spacing(1)
    }
}));

const DeleteButton: React.FC<{ title: string, description: string, onSend: Function}> =
    ({ title, description, onSend, children }) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false)

    const handleAccept = async () => {
        try {
            setOpen(false)
            setLoading(true)

            await onSend()

            enqueueSnackbar(`Успешно отправлен`, {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box sx={{position: 'relative', display: 'inline-block'}}>
                <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => setOpen(true)}
                    disabled={loading}
                >
                    {children}
                </Button>
                {loading && <CircularProgress
                    size={30}
                    color='secondary'
                    thickness={2}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-15px',
                        marginLeft: '-15px',
                    }}
                />}
            </Box>
            <Dialog
                open={isOpen}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle className={classes.title} disableTypography id="alert-dialog-title">
                    <Typography variant="h4">{title}</Typography>
                </DialogTitle>
                {
                    description && (
                        <DialogContent>
                            <DialogContentText>
                                {description}
                            </DialogContentText>
                        </DialogContent>
                    )
                }
                <DialogActions>
                    <Button onClick={() => setOpen(false)} size="large" color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleAccept} size="large" color="primary" autoFocus>
                        Отправить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteButton