import React from "react";
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
    const {stuffId: pathTab} = useParams<{ stuffId: string }>()
    const currentTab = getCurrentTab(pathTab)

    if (!currentTab) {
        history.go(-1)
        return null
    }

    return (
        <Page
            className={classes.root}
            title={'Заявки'}
        >
            <Container maxWidth="xl">
                <Header title={currentTab.label} linkName={currentTab.value}/>
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
                            <RefillBalanceListView />
                        </ApplicationTabPanel>
                        <ApplicationTabPanel index={'income-article'} value={currentTab.value}>
                            <IncomeArticleListView />
                        </ApplicationTabPanel>
                        <ApplicationTabPanel index={'outcome-article'} value={currentTab.value}>
                            <OutcomeArticleListView />
                        </ApplicationTabPanel>
                        <ApplicationTabPanel index={'outcome-transfer-warehouse'} value={currentTab.value}>
                            <OutcomeTransferWarehouseListView />
                        </ApplicationTabPanel>
                        <ApplicationTabPanel index={'road-driver'} value={currentTab.value}>
                            <RoadDriverListView />
                        </ApplicationTabPanel>
                    </Card>
                </Box>
            </Container>
        </Page>
    );
}

export default RoadStuffView;
