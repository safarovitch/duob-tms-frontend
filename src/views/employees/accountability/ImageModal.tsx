import React, {useRef, useState} from "react";
import {Box, Card, CardMedia, Dialog, Grid, IconButton, SvgIcon, Typography} from "@material-ui/core";
import {Image as ImageIcon, Trash as TrashIcon} from "react-feather";
import CloseIcon from '@material-ui/icons/Close';
import {Accountability} from "../../../model/Employee";
import LoadingDeleteButton from "../../../components/LoadingDeleteButton";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import employeeService from "../../../services/EmployeeService";
import {EMPLOYEE_ACCOUNTS_IMAGE_BASE_URL} from "../../../config";
import {AccountabilityType, mapOfAccountabilityType} from "../../../constants";
import ConfirmModal from "../../../components/ConfirmModal";
import usePermission from "../../../hooks/usePermission";
import PERMISSIONS from "../../../constants/permissions";

const ImageModal: React.FC<{accountability: Accountability, handleUpdate: Function}> = ({accountability, handleUpdate}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const hiddenFileInput = useRef<HTMLInputElement>(null)
    const canAddDeletePhoto = usePermission(PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.ADD_DELETE_PHOTO)

    const handleClick = () => {
        if (accountability.filePath) {
            setOpen(true)
        } else {
            canAddDeletePhoto && hiddenFileInput?.current?.click()
        }
    }

    const handleDelete = () => {
        setOpen(false)
        setOpenConfirmModal(true)
    }

    const handleSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist()

        const target = event.target as HTMLInputElement;
        const file = (target.files!)[0];

        if (file === undefined) return;

        try {
            setLoading(true)

            const data: any = await employeeService.uploadEmployeeAccountabilityImage(accountability.id!, file)

            handleUpdate(accountability.id!, data.name)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false);
        }
    }

    const handleAccept = async () => {
        try {
            setOpenConfirmModal(false)
            setLoading(true)

            await employeeService.deleteEmployeeAccountabilityImage(accountability.id!)
            handleUpdate(accountability.id!, null)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{position: 'relative', display: 'inline-block'}}>
            <input
                accept="image/*"
                type="file"
                hidden
                onChange={ handleSelectFile}
                ref={hiddenFileInput}
            />
            <IconButton onClick={handleClick}>
                <SvgIcon fontSize="small">
                    <ImageIcon />
                </SvgIcon>
            </IconButton>
            {loading  && <LoadingDeleteButton/>}
            <Dialog onClose={() => setOpen(false)} open={open}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h5">
                            <Box ml={2}>
                                {mapOfAccountabilityType.get(AccountabilityType[accountability.type])}
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item>
                        {canAddDeletePhoto && (
                            <IconButton onClick={handleDelete}>
                                <SvgIcon fontSize="small">
                                    <TrashIcon />
                                </SvgIcon>
                            </IconButton>
                        )}
                        <IconButton
                            edge="start"
                            onClick={() => setOpen(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Card>
                    <CardMedia component="img" alt="..."
                        image={EMPLOYEE_ACCOUNTS_IMAGE_BASE_URL + accountability.filePath}
                    />
                </Card>
            </Dialog>
            <ConfirmModal
                isOpen={openConfirmModal}
                title={'Вы уверены, что хотите удалить?'}
                description={'При удалие изображение, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этот изображение.'}
                onClose={() => setOpenConfirmModal(false)}
                onAccept={handleAccept}/>
        </Box>
    )
}

export default ImageModal