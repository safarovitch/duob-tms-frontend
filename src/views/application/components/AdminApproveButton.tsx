import React, {useState} from "react";
import {Box, IconButton, SvgIcon} from "@material-ui/core";
import ConfirmModal from "../../../components/ConfirmModal";
import LoadingDeleteButton from "../../../components/LoadingDeleteButton";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {Done as DoneIcon} from "@material-ui/icons";

const AdminApproveButton: React.FC<{ index: number, rowId: number, approveAdminApplication: Function, onApprove: Function}> =
    ({index, rowId, approveAdminApplication, onApprove}) => {

        const {enqueueSnackbar} = useSnackbar()
        const [loading, setLoading] = useState(false)
        const [isConfirmModalOpen, setOpen] = useState(false)
        const [selectedIndex, setIndex] = useState<number>()

        const handleClick = (index: number) => {
            setOpen(true)
            setIndex(index)
        }

        const handleAccept = async () => {
            try {
                setOpen(false)
                setLoading(true)

                await approveAdminApplication(rowId)

                onApprove(selectedIndex)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        }

        return (
            <>
                <Box sx={{m: 1, position: 'relative', display: 'inline-block'}}>
                    <IconButton
                        onClick={() => handleClick(index)}
                        disabled={loading && index === selectedIndex}
                    >
                        <SvgIcon fontSize="small">
                            <DoneIcon style={{color: 'red', fontWeight: 600}} />
                        </SvgIcon>
                    </IconButton>
                    {loading && index === selectedIndex && <LoadingDeleteButton/>}
                </Box>
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    title={'Вы уверены, что хотите подтвердить заявку?'}
                    description={'При подтверждении заявки, его нельзя будет отменить. Пожалуйста, убедитесь, что вы хотите подтвердить именно эту заявку.'}
                    onClose={() => setOpen(false)}
                    onAccept={handleAccept}/>
            </>
        )
    }

export default AdminApproveButton
