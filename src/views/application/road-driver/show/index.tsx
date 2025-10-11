import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {Box, Card, Container, Divider, Grid, makeStyles, Typography} from "@material-ui/core";
import hasPermission from "../../../../hooks/hasPermisson";
import {deleteSelectedRoadDriver, setSelectedRoadDriver} from "../../../../store/actions/applicationAction";
import {needUpdateWarehouseBalance} from "../../../../store/actions/warehouseActions";
import Page from "../../../../components/Page";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import PERMISSIONS from "../../../../constants/permissions";
import {RoadDriverApplicationResponse} from "../../../../model/Application";
import applicationService from "../../../../services/ApplicationService";
import Header from "./Header";
import ApproveApplication from "../../components/ApproveApplication";
import {mapOfRoadDriverApplicationType} from "../../../../constants";

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
    const roadDriver = useSelector((state: {selectedApplicationRoadDriver: RoadDriverApplicationResponse}) => state.selectedApplicationRoadDriver)
    const [loading, setLoading] = useState(false)
    const canApprove = hasPermission(PERMISSIONS.APPLICATION.ROAD_DRIVER.APPROVE)

    useEffect(() => () => {
        dispatch(deleteSelectedRoadDriver())
    }, [dispatch])

    if (!roadDriver) {
        history.go(-1);
        return null;
    }

    const handleApproveApplication = async () => {
        try {
            setLoading(true)

            const data: any = await applicationService.approveRoadDriver(roadDriver.id)

            dispatch(setSelectedRoadDriver(data))
            dispatch(needUpdateWarehouseBalance())
            enqueueSnackbar('Успешно подтверждено', {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <Page title={`Заявка №${roadDriver.id}`}>
            <Container className={classes.root} maxWidth="md">
                <Header roadDriver={roadDriver} />
                <Card className={classes.mainContent}>
                    <Box mb={2}>
                        <ApproveApplication isPaid={roadDriver.status === 'PAID'} canApprove={canApprove} loading={loading} onApproveApplication={handleApproveApplication} />
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
                                    {roadDriver.createdDate}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box my={3}>
                        {
                            roadDriver.driverId ? (
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4">
                                            Водитель:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            {roadDriver.driverName} #{roadDriver.driverId}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4">
                                            Менеджер:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            {roadDriver.createdByName} #{roadDriver.createdById}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Box>
                    <Divider />
                    <Box mt={3} mb={4}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4">
                                    {mapOfRoadDriverApplicationType.get(roadDriver.type)} по рейсу:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    {roadDriver.roadId} #{roadDriver.id}
                                </Typography>
                                <Typography variant="body1">
                                    Сумма: <b>{roadDriver.actualAmount === 0
                                        ? `${roadDriver.convertAmount} ${roadDriver.convertMoneyUnit}`
                                        : `${roadDriver.actualAmount} ${roadDriver.actualMoneyUnit}`}</b>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

export default ShowView;