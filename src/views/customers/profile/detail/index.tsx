import React from "react";
import {customerStuffTabs as tabs} from '../../../../constants';
import {Box, Card, Divider, Tab, Tabs} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {CustomerStuffTab} from "../../../../model/Customer";
import CustomerTabPanel from "./CustomerTabPanel";
import ReconciliationActListView from "./ReconciliationActListView";
import CargoListView from "./CargoListView";
import NotificationListView from "./NotificationListView";

const a11yProps = (tab: CustomerStuffTab) => ({id: `cargo-tab-${tab.value}`, 'aria-controls': `cargo-tabpanel-${tab.value}`})

const getCurrentTab = (pathTab: string) => tabs.find(item => item.value === pathTab)

const Detail: React.FC<{stuffId: string, tabPath: string}> = ({stuffId, tabPath}) => {
    const history = useHistory()
    const currentTab = getCurrentTab(stuffId)

    if (!currentTab) {
        history.go(-1)
        return null
    }

    return (
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
                            to={`${tabPath}/${tab.value}`}
                            component={Link}
                            {...a11yProps(tab)}
                        />
                    ))}
                </Tabs>
                <Divider/>
                <CustomerTabPanel index={'active-cargo'} value={currentTab}>
                    <CargoListView cargoStatus={'ACTIVE'} />
                </CustomerTabPanel>
                <CustomerTabPanel index={'received-cargo'} value={currentTab}>
                    <CargoListView cargoStatus={'ISSUED'}/>
                </CustomerTabPanel>
                <CustomerTabPanel index={'returned-cargo'} value={currentTab}>
                    <CargoListView cargoStatus={'RETURNED'}/>
                </CustomerTabPanel>
                <CustomerTabPanel index={'reconciliation-act'} value={currentTab}>
                    <ReconciliationActListView/>
                </CustomerTabPanel>
                <CustomerTabPanel index={'notification'} value={currentTab}>
                    <NotificationListView/>
                </CustomerTabPanel>
            </Card>
        </Box>
    );
}

export default Detail
