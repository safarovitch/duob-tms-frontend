import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Box, Button, Card, Container, Divider, Grid, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import Page from "../../../../components/Page";
import Header from "./Header";
import {RefillBalanceApplication} from "../../../../model/Application";
import {ApplicationStatusEnum, Currency, mapOfActionTypeApplication} from "../../../../constants";
import PERMISSIONS from "../../../../constants/permissions";
import applicationService from "../../../../services/ApplicationService";
import {deleteSelectedRefillBalance, setSelectedRefillBalance} from "../../../../store/actions/applicationAction";
import hasPermission from "../../../../hooks/hasPermisson";
import UploadImage from "../../components/UploadImage";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import {needUpdateWarehouseBalance} from "../../../../store/actions/warehouseActions";
import CashierApproveRefill from "../../components/CashierApprove";

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
    },
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
}));

const ShowView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const canApprove = hasPermission(PERMISSIONS.APPLICATION.REFILL_BALANCE.APPROVE)
    const canAddPhoto = hasPermission(PERMISSIONS.APPLICATION.REFILL_BALANCE.ADD_PHOTO)
    const refillBalance = useSelector((state: { selectedRefillBalance: RefillBalanceApplication }) => state.selectedRefillBalance)

    useEffect(() => () => {
        dispatch(deleteSelectedRefillBalance())
    }, [dispatch])

    if (!refillBalance) {
        history.go(-1);
        return null;
    }

    const handleApprove = (data: RefillBalanceApplication) => {
        dispatch(setSelectedRefillBalance(data))
        dispatch(needUpdateWarehouseBalance())
    }

    const handleAddImage = (images: string) => {
        const newRefillBalance = {...refillBalance, images}
        dispatch(setSelectedRefillBalance(newRefillBalance))
    }

    const isPaid = (): boolean => refillBalance.status === ApplicationStatusEnum.PAID;

    return (
        <Page title={`Заявка №${refillBalance.id}`}>
            <Container className={classes.root} maxWidth="md">
                <Header refillBalance={refillBalance}/>
                <Card className={classes.mainContent}>
                    <Box mb={2}>
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={() => history.go(-1)}
                            className={classes.action}
                        >
                            <SvgIcon
                                fontSize="small"
                                className={classes.actionIcon}
                            >
                                <NavigateBeforeIcon />
                            </SvgIcon>
                            Назад
                        </Button>
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
                                    {refillBalance.createdDate}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box my={3}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4">
                                    Клиент:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    {`${refillBalance.client?.name} #${refillBalance.client?.id}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    {
                        !isPaid() && canApprove && (
                            <Box mb={3}>
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4">
                                            Действие:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            {mapOfActionTypeApplication.get(refillBalance.actionType)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                    }
                    <Divider />
                    <Box mt={3} mb={4}>
                        {
                            !isPaid() && canApprove ? (
                                <CashierApproveRefill
                                    applicationId={refillBalance.id!}
                                    currencyExchangeData={refillBalance}
                                    onApprove={applicationService.approveRefillBalance}
                                    handleApprove={handleApprove}
                                />
                            ) : (
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4">
                                            {mapOfActionTypeApplication.get(refillBalance.actionType)}:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            Сумма: <b>{`${refillBalance.actualAmount} ${refillBalance.actualMoneyUnit}`}</b>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <b>{`${refillBalance.convertAmount} ${refillBalance.convertMoneyUnit}`}</b>
                                        </Typography>
                                        <Typography variant="body1">
                                            Курс конвертации: <b>{refillBalance.currency}</b>
                                        </Typography>
                                        <Typography variant="body1">
                                            Итого: <b>{refillBalance.totalAmount} {Currency.USD}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        }
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
