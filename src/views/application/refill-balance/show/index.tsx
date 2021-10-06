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
import {RefillBalanceApplication} from "../../../../model/Application";
import {mapOfActionTypeApplication, mapOfStatusApplication} from "../../../../constants";
import PERMISSIONS from "../../../../constants/permissions";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import applicationService from "../../../../services/Application";
import {deleteSelectedRefillBalance, setSelectedRefillBalance} from "../../../../store/actions/applicationAction";
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
    const canApprove = usePermission(PERMISSIONS.APPLICATION.REFILL_BALANCE.APPROVE)
    const canAddPhoto = usePermission(PERMISSIONS.APPLICATION.REFILL_BALANCE.ADD_PHOTO)
    const [loading, setLoading] = useState(false)
    const refillBalance = useSelector((state: { selectedRefillBalance: RefillBalanceApplication }) => state.selectedRefillBalance)

    useEffect(() => () => {
        dispatch(deleteSelectedRefillBalance())
    }, [])

    if (!refillBalance) {
        history.go(-1);
        return null;
    }

    const handleApproveApplication = async () => {
        try {
            setLoading(true)

            const fetchRefillBalance: any = await applicationService.approveRefillBalance(refillBalance.id!)

            dispatch(setSelectedRefillBalance(fetchRefillBalance))
            enqueueSnackbar('Успешно подтверждено', {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleAddImage = (images: string) => {
        const newRefillBalance = {...refillBalance, images}
        dispatch(setSelectedRefillBalance(newRefillBalance))
    }

    const isPaidApplication = (row: RefillBalanceApplication): boolean => row.status === 'PAID';

    return (
        <Page title={`Заявка №${refillBalance.id}`}>
            <Container className={classes.root} maxWidth="md">
                <Header refillBalance={refillBalance}/>
                <Card className={classes.mainContent}>
                    <Box mb={2}>
                        <ApproveApplication isPaid={isPaidApplication(refillBalance)} canApprove={canApprove} loading={loading} onApproveApplication={handleApproveApplication} />
                    </Box>
                    <Divider />
                    <Box mt={3} mb={4}>
                        <Grid
                            container
                            justifyContent="space-between"
                        >
                            <Grid item>
                                <Typography variant="h3" className={classes.mb1}>
                                    {mapOfActionTypeApplication.get(refillBalance.actionType)}
                                </Typography>
                                <Typography variant="body1" >
                                    Клиент: {refillBalance.client?.name}
                                    <br/>
                                    Идентификатор клиента: #{refillBalance.client?.id}
                                    <br/>
                                    Сумма: {`${refillBalance.amount} ${refillBalance.moneyUnit}`}
                                    <br/>
                                    Курс конвертации: {refillBalance.currency}
                                    <br/>
                                    <b>Итого: {refillBalance.totalUSD} $</b>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h3" className={classes.mb1}>
                                    Заявка
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="textPrimary"
                                >
                                    Дата заявки: {refillBalance.createdDate}
                                    <br/>
                                    Дата оплаты: {isPaidApplication(refillBalance) ? refillBalance.updatedDate : "-"}
                                    <br/>
                                    Статус: {mapOfStatusApplication.get(refillBalance.status!)}
                                    <br/>
                                    Коментарии: {refillBalance.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box my={4}>
                        <UploadImage images={refillBalance.images!} canAddPhoto={canAddPhoto} applicationId={refillBalance.id!} onAddImage={handleAddImage} />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

export default ShowView;
