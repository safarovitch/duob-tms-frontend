import React, {useState} from "react";
import {Box, Checkbox, CircularProgress, FormControlLabel, makeStyles} from "@material-ui/core";
import {CargoIssueResponse} from "../../../../model/Cargo";
import cargoService from "../../../../services/CargoService";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import ConfirmModal from "../../../../components/ConfirmModal";

const useStyles = makeStyles(() => ({
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        right: '40%',
        marginTop: '-10px',
    }
}));

const CreditCheckbox: React.FC<{canCheckedCredit: boolean, cargoIssue: CargoIssueResponse, handleChecked: Function}> =
    ({canCheckedCredit, cargoIssue, handleChecked}) => {
    const [isConfirmModalOpen, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const {enqueueSnackbar} = useSnackbar()
    const classes = useStyles()

    const handleCheckedCredit = async () => {
        try {
            setOpen(false)
            setLoading(true)
            console.log(cargoIssue)

            await cargoService.creditCargoIssue(cargoIssue.id)

            enqueueSnackbar('Успешно', {variant: 'success'})

            let data = {...cargoIssue, credit: !cargoIssue.credit}

            handleChecked(data)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box style={{position: 'relative', display: 'inline-block'}}>
                <FormControlLabel control={
                    <Checkbox
                        checked={cargoIssue.credit}
                        onClick={() => setOpen(true)}
                        disabled={loading || !canCheckedCredit}
                    />
                } label="Кредит" />
                {loading && <CircularProgress size={20} className={classes.loadingProgress} />}
            </Box>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={'Вы уверены, что хотите оформить кредит?'}
                description={'При подтверждении, кленту будет оформлен кредит.'}
                onClose={() => setOpen(false)}
                onAccept={handleCheckedCredit}
            />
        </>
    )
}

export default CreditCheckbox