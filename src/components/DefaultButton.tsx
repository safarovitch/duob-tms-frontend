import React, {useState} from "react";
import {Box, IconButton, SvgIcon} from "@material-ui/core";
import {Done as DoneIcon, DoneAll as DoneAllIcon} from "@material-ui/icons";
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
                    <DoneAllIcon />
                </IconButton>
            ) : (
                <Box sx={{position: 'relative', display: 'inline-block'}}>
                    <IconButton
                        onClick={() => setOpen(true)}
                        disabled={loading}
                    >
                        <SvgIcon fontSize="small">
                            <DoneIcon />
                        </SvgIcon>
                    </IconButton>
                    {loading && <LoadingDeleteButton/>}
                </Box>
            )}
            <ConfirmModal
                isOpen={isOpen}
                title={'Выбор значений по умолчанию'}
                description={'Выберите значение по умолчанию для константа груза.'}
                onClose={() => setOpen(false)}
                onAccept={handleAccept}/>
        </>
    )
}

export default DefaultButton