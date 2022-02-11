import React, {useState} from "react";
import {Box, IconButton, SvgIcon} from "@material-ui/core";
import {Copy as CopyIcon} from "react-feather";
import {useSnackbar} from "notistack";
import LoadingDeleteButton from "../../components/LoadingDeleteButton";
import ConfirmModal from "../../components/ConfirmModal";
import errorMessageHandler from "../../utils/errorMessageHandler";

const CopyInvoiceButton: React.FC<{id: number, onCopy: Function, handleCopy: Function, disabled: boolean}> = ({id, onCopy, handleCopy, disabled}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [isConfirmModalOpen, setOpen] = useState(false)

    const handleAccept = async () => {
        try {
            setOpen(false)
            setLoading(true)

            await onCopy(id)

            enqueueSnackbar(`Успешно`, {variant: 'success'})
            handleCopy()
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            setLoading(false)
        }
    }

    return (
        <>
            <Box sx={{position: 'relative', display: 'inline-block'}}>
                <IconButton
                    onClick={() => setOpen(true)}
                    disabled={loading || disabled}
                >
                    <SvgIcon fontSize="small">
                        <CopyIcon/>
                    </SvgIcon>
                </IconButton>
                {loading && <LoadingDeleteButton/>}
            </Box>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={'Вы уверены, что хотите копировать?'}
                description={'При копирование инвойса, создается его дубликат. Пожалуйста, убедитесь, что вы хотите копировать именно этот инвойс.'}
                onClose={() => setOpen(false)}
                onAccept={handleAccept}/>
        </>
    )
}

export default CopyInvoiceButton