import React, {useState} from "react";
import {Box, Button, CircularProgress, Grid, makeStyles, SvgIcon} from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import {Done as DoneIcon} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import ConfirmModal from "../../../components/ConfirmModal";

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

interface ApproveApplicationInterface{
    isPaid: boolean,
    canApprove: boolean,
    loading: boolean,
    onApproveApplication: Function
}

const ApproveApplication: React.FC<ApproveApplicationInterface> = ({isPaid, canApprove, loading, onApproveApplication}) => {
    const classes = useStyles()
    const history = useHistory()
    const [isConfirmModalOpen, setOpen] = useState(false)

    const handleAccept = () => {
        setOpen(false)
        onApproveApplication()
    }

    return (
        <>
            <Grid
                container
                justifyContent="space-between"
            >
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => history.go(-1)}
                    className={classes.action}
                >
                    <SvgIcon
                        fontSize="small"
                        className={classes.actionIcon}
                    >
                        <NavigateBeforeIcon />
                    </SvgIcon>
                    Назад
                </Button>
                {
                    !isPaid && canApprove && (
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
                    )
                }
            </Grid>
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

export default ApproveApplication
