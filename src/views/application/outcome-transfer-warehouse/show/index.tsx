import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {
    Box,
    Card,
    Container,
    Divider,
    Grid,
    makeStyles,
    Typography
} from "@material-ui/core";
import Page from "../../../../components/Page";
import Header from "./Header";
import {OutcomeTransferWarehouseApplication} from "../../../../model/Application";
import PERMISSIONS from "../../../../constants/permissions";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import applicationService from "../../../../services/Application";
import {deleteSelectedOutcomeTransferWarehouse, setSelectedOutcomeTransferWarehouse} from "../../../../store/actions/applicationAction";
import usePermission from "../../../../hooks/usePermission";
import UploadImage from "../../components/UploadImage";
import ApproveApplication from "../../components/ApproveApplication";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    mainContent: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
    },
    mb1: {
        marginBottom: '8px',
    }
}));

const ShowView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const canApprove = usePermission(PERMISSIONS.APPLICATION.OUTCOME_TRANSFER_WAREHOUSE.APPROVE)
    const canAddPhoto = usePermission(PERMISSIONS.APPLICATION.OUTCOME_TRANSFER_WAREHOUSE.ADD_PHOTO)
    const [loading, setLoading] = useState(false)
    const outcomeTransferWarehouse = useSelector((state: { selectedApplicationOutcomeTransferWarehouse: OutcomeTransferWarehouseApplication }) => state.selectedApplicationOutcomeTransferWarehouse)

    useEffect(() => () => {
        dispatch(deleteSelectedOutcomeTransferWarehouse())
    }, [])

    if (!outcomeTransferWarehouse) {
        history.go(-1);
        return null;
    }

    const handleApproveApplication = async () => {
        try {
            setLoading(true)

            const fetchOutcomeTransferWarehouse: any = await applicationService.approveTransferWarehouse(outcomeTransferWarehouse.id!)

            dispatch(setSelectedOutcomeTransferWarehouse(fetchOutcomeTransferWarehouse))
            enqueueSnackbar('Успешно подтверждено', {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const handleAddImage = (images: string) => {
        const newOutcomeTransferWarehouse = {...outcomeTransferWarehouse, images}
        dispatch(setSelectedOutcomeTransferWarehouse(newOutcomeTransferWarehouse))
    }

    const isPaidApplication = (row: OutcomeTransferWarehouseApplication): boolean => row.status === 'PAID';

    return (
        <Page title={`Заявка №${outcomeTransferWarehouse.id}`}>
            <Container className={classes.root} maxWidth="md">
                <Header outcomeTransferWarehouse={outcomeTransferWarehouse}/>
                <Card className={classes.mainContent}>
                    <Box mb={2}>
                        <ApproveApplication isPaid={isPaidApplication(outcomeTransferWarehouse)} canApprove={canApprove} loading={loading} onApproveApplication={handleApproveApplication} />
                    </Box>
                    <Divider />
                    <Box mt={3}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4">
                                    Дата заявки:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    {outcomeTransferWarehouse.createdDate}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box my={3}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4">
                                    Склад:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    {`${outcomeTransferWarehouse.toWarehouse?.name} #${outcomeTransferWarehouse.toWarehouse?.id}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box mt={3} mb={4}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4">
                                    Перевод денег:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    <b>Сумма: {outcomeTransferWarehouse.amount}</b>
                                </Typography>
                                <Typography variant="body1">
                                    <b>Валюта: {outcomeTransferWarehouse.moneyUnit}</b>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box my={4}>
                        <UploadImage images={outcomeTransferWarehouse.images!} canAddPhoto={canAddPhoto} applicationId={outcomeTransferWarehouse.id!} onAddImage={handleAddImage} />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

export default ShowView;

