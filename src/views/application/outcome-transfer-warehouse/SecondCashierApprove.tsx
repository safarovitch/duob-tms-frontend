import React, {useState} from "react";
import {Box, Button, CircularProgress, makeStyles, SvgIcon} from "@material-ui/core";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import ConfirmModal from "../../../components/ConfirmModal";
import {Done as DoneIcon} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        left: '14px',
        marginTop: '-14px',
    }
}));

const SecondCashierApprove: React.FC<{ applicationId: number, onApprove: Function, handleApprove: Function }> = ({
                                                                                                         applicationId,
                                                                                                         onApprove,
                                                                                                         handleApprove
                                                                                                     }) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [isConfirmModalOpen, setOpen] = useState(false)


    const handleAccept = async () => {
        try {
            setOpen(false)
            setLoading(true)

            const data: any = await onApprove(applicationId)

            enqueueSnackbar(`Успешно подтверждено`, {variant: 'success'})
            handleApprove(data)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box style={{position: 'relative'}}>
                <Button
                    color="secondary"
                    variant="contained"
                    className={classes.action}
                    onClick={() => setOpen(true)}
                    disabled={loading}
                >
                    <SvgIcon
                        fontSize="small"
                        className={classes.actionIcon}
                    >
                        {!loading && <DoneIcon />}
                    </SvgIcon>
                    Подтвердить
                </Button>
                {loading && <CircularProgress size={20} className={classes.loadingProgress} />}
            </Box>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={'Вы уверены, что хотите подтвердить заявку?'}
                description={'При подтверждении заявки, его нельзя будет отменить. Пожалуйста, убедитесь, что вы хотите подтвердить именно эту заявку.'}
                onClose={() => setOpen(false)}
                onAccept={handleAccept}
            />
        </>
    )
}

export default SecondCashierApprove