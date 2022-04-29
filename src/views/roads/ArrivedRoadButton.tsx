import React, {useState} from "react";
import {Box, Button, CircularProgress, makeStyles, SvgIcon} from "@material-ui/core";
import ConfirmModal from "../../components/ConfirmModal";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import roadService from "../../services/RoadService";
import {RoadStatusEnum} from "../../constants";
import {Done as DoneIcon} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: '-14px',
        marginTop: '-14px',
    },
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
}));

const ArrivedRoadButton: React.FC<{status: RoadStatusEnum, roadId: number, updateRoad: Function}> = ({status, roadId, updateRoad}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [isConfirmModalOpen, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleAccept = async () => {
        try {
            setOpen(false)
            setLoading(true)

            await roadService.arrivedRoad(roadId)

            enqueueSnackbar('Рейс прибыл', {variant: 'success'})
            updateRoad()
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return RoadStatusEnum.ARRIVED === status || RoadStatusEnum.COMPLETED === status ?
    (
        <Button
            className={classes.action}
            variant="outlined"
            color="primary"
            disabled
        >
            <SvgIcon fontSize="small" className={classes.actionIcon}>
                <DoneIcon />
            </SvgIcon>
            Прибыл
        </Button>
    ) : (
        <>
            <Box style={{position: 'relative'}}>
                <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    onClick={() => setOpen(true)}
                    disabled={loading || status !== RoadStatusEnum.LOADED}
                >
                    Прибыл
                </Button>
                {loading && <CircularProgress size={20} className={classes.loadingProgress} />}
            </Box>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={'Вы уверены?'}
                description={'Пожалуйста, убедитесь, что именно этот рейс прибыль.'}
                onClose={() => setOpen(false)}
                onAccept={handleAccept}
            />
        </>
    )
}

export default ArrivedRoadButton