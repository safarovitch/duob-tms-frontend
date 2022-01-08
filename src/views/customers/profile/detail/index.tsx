import React from "react";
import {customerStuffTabs as tabs} from '../../../../constants';
import {Badge, Box, Card, Divider, Tab, Tabs} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {Customer, CustomerStuffTab} from "../../../../model/Customer";
import CustomerTabPanel from "./CustomerTabPanel";
import ReconciliationActListView from "./ReconciliationActListView";
import CargoListView from "./CargoListView";
import NotificationListView from "./NotificationListView";
import CreditListView from "./credit/CreditListView";

const a11yProps = (tab: CustomerStuffTab) => ({
    id: `cargo-tab-${tab.value}`,
    'aria-controls': `cargo-tabpanel-${tab.value}`
})

const getCurrentTab = (pathTab: string) => tabs.find(item => item.value === pathTab)

const Detail: React.FC<{ stuffId: string, tabPath: string, customer: Customer }> = ({stuffId, tabPath, customer}) => {
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
                            label={tab.hasBadge ? <Badge color="error" badgeContent={customer.unconfirmedCredit}>{tab.label}</Badge> : tab.label}
                            to={`${tabPath}/${tab.value}`}
                            component={Link}
                            {...a11yProps(tab)}
                        />
                    ))}
                </Tabs>
                <Divider/>
                <CustomerTabPanel index={'cargos'} value={currentTab}>
                    <CargoListView/>
                </CustomerTabPanel>
                <CustomerTabPanel index={'reconciliation-act'} value={currentTab}>
                    <ReconciliationActListView/>
                </CustomerTabPanel>
                <CustomerTabPanel index={'credits'} value={currentTab}>
                    <CreditListView/>
                </CustomerTabPanel>
                <CustomerTabPanel index={'notification'} value={currentTab}>
                    <NotificationListView/>
                </CustomerTabPanel>
            </Card>
        </Box>
    );
}

export default Detail
