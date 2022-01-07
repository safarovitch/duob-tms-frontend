import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    Box, Button,
    Card,
    Container,
    Divider,
    Grid,
    makeStyles, SvgIcon,
    Typography
} from "@material-ui/core";
import Page from "../../../../components/Page";
import Header from "./Header";
import {OutcomeTransferWarehouseApplication} from "../../../../model/Application";
import PERMISSIONS from "../../../../constants/permissions";
import applicationService from "../../../../services/Application";
import {deleteSelectedOutcomeTransferWarehouse, setSelectedOutcomeTransferWarehouse} from "../../../../store/actions/applicationAction";
import usePermission from "../../../../hooks/usePermission";
import UploadImage from "../../components/UploadImage";
import {User} from "../../../../model/User";
import {needUpdateWarehouseBalance} from "../../../../store/actions/warehouseActions";
import {ApplicationStatusEnum, Currency} from "../../../../constants";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import CashierApprove from "../../components/CashierApprove";
import SecondCashierApprove from "../SecondCashierApprove";

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
    const canApprove = usePermission(PERMISSIONS.APPLICATION.OUTCOME_TRANSFER_WAREHOUSE.APPROVE)
    const canAddPhoto = usePermission(PERMISSIONS.APPLICATION.OUTCOME_TRANSFER_WAREHOUSE.ADD_PHOTO)
    const {selectedApplicationOutcomeTransferWarehouse: outcomeTransferWarehouse, user} =
        useSelector((state: {selectedApplicationOutcomeTransferWarehouse: OutcomeTransferWarehouseApplication, user: User}) => state)

    useEffect(() => () => {
        dispatch(deleteSelectedOutcomeTransferWarehouse())
    }, [dispatch])

    if (!outcomeTransferWarehouse) {
        history.go(-1);
        return null;
    }

    const handleApprove = (data: OutcomeTransferWarehouseApplication) => {
        dispatch(setSelectedOutcomeTransferWarehouse(data))
        dispatch(needUpdateWarehouseBalance())
    }

    const handleAddImage = (images: string) => {
        const newOutcomeTransferWarehouse = {...outcomeTransferWarehouse, images}
        dispatch(setSelectedOutcomeTransferWarehouse(newOutcomeTransferWarehouse))
    }

    const isPaid = (): boolean => outcomeTransferWarehouse.status === ApplicationStatusEnum.PAID;
    const canApproveFirstCashier = () => canApprove && (outcomeTransferWarehouse.fromCashier === undefined);
    const canApproveSecondCashier = () => canApprove && outcomeTransferWarehouse.fromCashier && (user.userId !== outcomeTransferWarehouse.fromCashier?.id);

    return (
        <Page title={`Заявка №${outcomeTransferWarehouse.id}`}>
            <Container className={classes.root} maxWidth="md">
                <Header outcomeTransferWarehouse={outcomeTransferWarehouse}/>
                <Card className={classes.mainContent}>
                    <Box mb={2}>
                        <Grid
                            container
                            justifyContent="space-between"
                        >
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
                            {
                                !isPaid() && canApproveSecondCashier() && (
                                    <SecondCashierApprove
                                        applicationId={outcomeTransferWarehouse.id!}
                                        onApprove={applicationService.approveSecondCashierTransferWarehouse}
                                        handleApprove={handleApprove}
                                    />
                                )
                            }
                        </Grid>
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
                    {
                        !isPaid() && canApproveFirstCashier() && (
                            <Box mb={3}>
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4">
                                            Перевод денег:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            Из <b>{outcomeTransferWarehouse.fromWarehouse?.name}</b> в <b>{outcomeTransferWarehouse.toWarehouse?.name}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                    }
                    <Divider />
                    <Box mt={3} mb={4}>
                        {
                            !isPaid() && canApproveFirstCashier() ? (
                                <CashierApprove
                                    disabledTJS={true}
                                    applicationId={outcomeTransferWarehouse.id!}
                                    currencyExchangeData={outcomeTransferWarehouse}
                                    onApprove={applicationService.approveTransferWarehouse}
                                    handleApprove={handleApprove}
                                />
                            ) : (
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4">
                                            Перевод денег:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            Сумма: <b>{`${outcomeTransferWarehouse.actualAmount} ${outcomeTransferWarehouse.actualMoneyUnit}`}</b>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <b>{`${outcomeTransferWarehouse.convertAmount} ${outcomeTransferWarehouse.convertMoneyUnit}`}</b>
                                        </Typography>
                                        <Typography variant="body1">
                                            Курс конвертации: <b>{outcomeTransferWarehouse.currency}</b>
                                        </Typography>
                                        <Typography variant="body1">
                                            Итого: <b>{outcomeTransferWarehouse.totalAmount} {Currency.USD}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        }
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

