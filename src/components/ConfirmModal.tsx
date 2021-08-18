import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, LinearProgress,
    makeStyles, Typography
} from "@material-ui/core";
import React, {useEffect} from "react";
import NProgress from "nprogress";

const useStyles = makeStyles((theme) => ({
    root: {
        // alignItems: 'center',
        // backgroundColor: theme.palette.background.default,
        // display: 'flex',
        // flexDirection: 'column',
        // height: '100%',
        // justifyContent: 'center',
        // minHeight: '100%',
        // padding: theme.spacing(3)
    },
    title: {
        marginTop: 16
    }
}));
interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    onAccept: () => void;
}
const ConfirmModal: React.FC<ConfirmModalProps> = (props: ConfirmModalProps) => {
    const {isOpen, title, description, onClose, onAccept} = props;
    const classes = useStyles();

    return (
        // <div className={classes.root}>
        //     <Box width={400}>
        //         <LinearProgress />
        //     </Box>
        // </div>
        <Dialog
            className={classes.root}
            open={isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
        >
            <DialogTitle className={classes.title} disableTypography id="alert-dialog-title"><Typography variant="h4">{title}</Typography></DialogTitle>
            {description && (<DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>)}
            <DialogActions>
                <Button onClick={onClose} size="large" color="primary">
                    Отмена
                </Button>
                <Button onClick={onAccept} size="large" color="primary" autoFocus>
                    ОК
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmModal;


