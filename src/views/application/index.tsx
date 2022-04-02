import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {useParams} from "react-router";
import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import Page from "../../components/Page";
import Header from "./Header";
import {applicationStuffTabs as tabs} from '../../constants'
import {ApplicationStuffTab} from "../../model/Application";
import ApplicationTabPanel from "./ApplicationTabPanel";
import RefillBalanceListView from "./refill-balance/RefillBalanceListView";
import IncomeArticleListView from "./income-article/IncomeArticleListView";
import OutcomeArticleListView from "./outcome-article/OutcomeArticleListView";
import OutcomeTransferWarehouseListView from "./outcome-transfer-warehouse/OutcomeTransferWarehouseListView";
import RoadDriverListView from "./road-driver/RoadDriverListView";
import {Warehouse} from "../../model/Warehouse";
import warehouseService from "../../services/WarehouseService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import hasPermission from "../../hooks/hasPermisson";
import PERMISSIONS from "../../constants/permissions";
import LoadingLayout from "../../components/LoadingLayout";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const a11yProps = (tab: ApplicationStuffTab) => ({id: `application-tab-${tab.value}`, 'aria-controls': `application-tabpanel-${tab.value}`})

const getCurrentTab = (pathTab: string) => tabs.find(item => item.value === pathTab)

const RoadStuffView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [warehouseId, setWarehouseId] = useState<number>()
    const {stuffId: pathTab} = useParams<{ stuffId: string }>()
    const currentTab = getCurrentTab(pathTab)
    const isAdmin = hasPermission(PERMISSIONS.ADMIN)

    useEffect(() => {
        let cancel = false;

        currentTab && isAdmin && (async () => {
            try {
                setLoading(true)

                const dataWarehouses: any = await warehouseService.getAllWarehouse()

                if (dataWarehouses.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала склад', {variant: 'info'})
                } else if (!cancel) {
                    setWarehouseId(dataWarehouses.find((item: Warehouse) => item.name === "Душанбе")?.id)
                    setWarehouses(dataWarehouses)
                }
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, history, currentTab, isAdmin])

    if (!currentTab) {
        history.go(-1)
        return null
    }

    return (
        <Page title={'Заявки'}>
            {
                ((isAdmin && warehouses.length === 0) || (isAdmin && !warehouseId)) ? (
                    <LoadingLayout loading={loading} hasError={hasError}/>
                ) : (
                    <Container className={classes.root} maxWidth="xl">
                        <Header
                            title={currentTab.label}
                            linkName={currentTab.value}
                            warehouses={warehouses}
                            warehouseId={warehouseId}
                            setWarehouseId={setWarehouseId}
                        />
                        <Box mt={3}>
                            <Card>
                                <Tabs
                                    scrollButtons="auto"
                                    textColor="secondary"
                                    value={currentTab.value}
                                    centered
                                >
                                    {tabs.map((tab) => (
                                        <Tab
                                            key={tab.value}
                                            value={tab.value}
                                            label={tab.label}
                                            to={tab.value}
                                            component={Link}
                                            {...a11yProps(tab)}
                                        />
                                    ))}
                                </Tabs>
                                <Divider/>
                                <ApplicationTabPanel index={'refill-balance'} value={currentTab.value}>
                                    <RefillBalanceListView warehouseId={warehouseId}/>
                                </ApplicationTabPanel>
                                <ApplicationTabPanel index={'income-article'} value={currentTab.value}>
                                    <IncomeArticleListView warehouseId={warehouseId} />
                                </ApplicationTabPanel>
                                <ApplicationTabPanel index={'outcome-article'} value={currentTab.value}>
                                    <OutcomeArticleListView warehouseId={warehouseId} />
                                </ApplicationTabPanel>
                                <ApplicationTabPanel index={'outcome-transfer-warehouse'} value={currentTab.value}>
                                    <OutcomeTransferWarehouseListView warehouseId={warehouseId} />
                                </ApplicationTabPanel>
                                <ApplicationTabPanel index={'road-driver'} value={currentTab.value}>
                                    <RoadDriverListView warehouseId={warehouseId} />
                                </ApplicationTabPanel>
                            </Card>
                        </Box>
                    </Container>
                )
            }
        </Page>
    );
}

export default RoadStuffView;
