import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles, Typography
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
    root: {},
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


