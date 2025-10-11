import React, {useState} from "react";
import {Box, IconButton, SvgIcon} from "@material-ui/core";
import ConfirmModal from "./ConfirmModal";
import LoadingDeleteButton from "./LoadingDeleteButton";
import errorMessageHandler from "../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {Trash as TrashIcon} from "react-feather";

const DeleteButton: React.FC<{ index: number, rowId: number, onDelete: Function, handleDelete: Function}> =
    ({index, rowId, onDelete, handleDelete}) => {

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

                await onDelete(rowId)

                enqueueSnackbar(`Успешно удалено`, {variant: 'success'})
                handleDelete(selectedIndex)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                setLoading(false)
            }
        }

        return (
            <>
                <Box sx={{position: 'relative', display: 'inline-block'}}>
                    <IconButton
                        onClick={() => handleClick(index)}
                        disabled={loading && index === selectedIndex}
                    >
                        <SvgIcon fontSize="small">
                            <TrashIcon />
                        </SvgIcon>
                    </IconButton>
                    {loading && index === selectedIndex && <LoadingDeleteButton/>}
                </Box>
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    title={'Вы уверены, что хотите удалить?'}
                    description={'При удалие записи, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этот запись.'}
                    onClose={() => setOpen(false)}
                    onAccept={handleAccept}/>
            </>
        )
    }

export default DeleteButton
