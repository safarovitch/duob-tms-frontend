import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router";
import Page from "../../components/Page";
import React, {useState} from "react";
import Header from "./Header";
import {applicationStuffTabs as tabs} from '../../constants'
import {ApplicationStuffTab} from "../../model/Application";
import ApplicationTabPanel from "./ApplicationTabPanel";
import RefillBalanceListView from "./refill-balance/RefillBalanceListView";
import IncomeArticleListView from "./income-article/IncomeArticleListView";
import OutcomeArticleListView from "./outcome-article/OutcomeArticleListView";
import OutcomeTransferWarehouseListView from "./outcome-transfer-warehouse/OutcomeTransferWarehouseListView";

const getCurrentTab = (stuffId: string) => {
    return tabs.filter(v => v.value === stuffId)[0];
}

const a11yProps = (tab: ApplicationStuffTab) => ({id: `application-tab-${tab.value}`, 'aria-controls': `application-tabpanel-${tab.value}`})

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const RoadStuffView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {stuffId} = useParams<{ stuffId: string }>()
    const [currentTab, setCurrentTab] = useState<ApplicationStuffTab>(getCurrentTab(stuffId))

    const handleTabsChange = (event: React.ChangeEvent<{}>, tab: ApplicationStuffTab) => {
        setCurrentTab(tab)
        history.push('/app/application/' + tab.value);
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
                            onChange={handleTabsChange}
                            scrollButtons="auto"
                            textColor="secondary"
                            value={currentTab}
                            centered
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.value}
                                    value={tab}
                                    label={tab.label}
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
                    </Card>

                </Box>
            </Container>
        </Page>
    );
}

export default RoadStuffView;
