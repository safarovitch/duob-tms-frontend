import React, {useState} from "react";
import {Box, Button, CircularProgress, makeStyles, SvgIcon} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {Download as DownloadIcon} from "react-feather";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import * as fileSaver from "file-saver";
import customerService from "../../../../services/CustomerService";

const useStyles = makeStyles((theme) => ({
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-10px',
        marginLeft: '-10px',
    },
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    }
}));

interface DownloadCargosButtonInterface {
    customerId: number;
    startDate: string;
    endDate: string;
}

const DownloadCargosButton: React.FC<DownloadCargosButtonInterface> = (props) => {
    let {customerId, startDate, endDate} = props
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        try {
            setLoading(true)

            const data: any = await customerService.generateCargos(customerId, startDate, endDate)
            const fileBuffer: ArrayBuffer = await customerService.getGenerateCargos(data.fileName) as ArrayBuffer
            const blob = new Blob([fileBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
            fileSaver.saveAs(blob, `Грузы от ${startDate} до ${endDate}.xlsx`)

            enqueueSnackbar(`Успешно`, {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box style={{position: 'relative'}}>
            <Button
                color="secondary"
                variant="outlined"
                className={classes.action}
                onClick={handleClick}
                disabled={loading}
            >
                <SvgIcon fontSize="small" className={classes.actionIcon}>
                    <DownloadIcon />
                </SvgIcon>
                Скачать
            </Button>
            {loading && <CircularProgress size={20} className={classes.loadingProgress}/>}
        </Box>
    )
}

export default DownloadCargosButton