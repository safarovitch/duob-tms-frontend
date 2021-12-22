import React, {useState} from "react";
import {Box, IconButton, SvgIcon, Tooltip} from "@material-ui/core";
import {Done as DoneIcon, CheckCircle as CheckCircleIcon} from "@material-ui/icons";
import ConfirmModal from "./ConfirmModal";
import LoadingDeleteButton from "./LoadingDeleteButton";
import errorMessageHandler from "../utils/errorMessageHandler";
import {useSnackbar} from "notistack";

const DefaultButton: React.FC<{rowId: number, rowDefault: boolean, onSetDefault: Function, handleSetDefault: Function}> =
    ({ rowId, rowDefault, onSetDefault, handleSetDefault }) => {
        const {enqueueSnackbar} = useSnackbar()
        const [loading, setLoading] = useState(false)
        const [isOpen, setOpen] = useState(false)

        const handleAccept = async () => {
            try {
                setOpen(false)
                setLoading(true)

                await onSetDefault(rowId)

                enqueueSnackbar(`Успешно выбрано`, {variant: 'success'})
                handleSetDefault()
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                setLoading(false)
            }
        }

        return (
        <>
            {rowDefault ? (
                <IconButton disabled>
                    <CheckCircleIcon style={{color: '1B9A4F'}} />
                </IconButton>
            ) : (
                <Box sx={{position: 'relative', display: 'inline-block'}}>
                    <Tooltip title="Выбрать по умолчанию">
                        <IconButton
                            onClick={() => setOpen(true)}
                            disabled={loading}
                        >
                            <SvgIcon fontSize="small">
                                <DoneIcon />
                            </SvgIcon>
                        </IconButton>
                    </Tooltip>
                    {loading && <LoadingDeleteButton/>}
                </Box>
            )}
            <ConfirmModal
                isOpen={isOpen}
                title={'Вы уверены?'}
                description={'При подтверждении значения константа становиться по умолчанию.'}
                onClose={() => setOpen(false)}
                onAccept={handleAccept}/>
        </>
    )
}

export default DefaultButton