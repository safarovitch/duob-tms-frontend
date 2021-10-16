import React, {useState} from "react";
import {customerStuffTabs as tabs} from '../../../../constants';
import {Box, Card, Divider, Tab, Tabs} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {CargoStuffTab} from "../../../../model/Cargo";
import {CustomerStuffTab} from "../../../../model/Customer";
import CustomerTabPanel from "./CustomerTabPanel";
import ReconciliationActListView from "./ReconciliationActListView";
import CargoListView from "./CargoListView";

function getCurrentTab(stuffId: string) {
    return tabs.filter(v => v.value === stuffId)[0];
}

function a11yProps(tab: CustomerStuffTab) {
    return {
        id: `cargo-tab-${tab.value}`,
        'aria-controls': `cargo-tabpanel-${tab.value}`,
    };
}

const Detail: React.FC<{stuffId: string, tabPath: string}> = ({stuffId, tabPath}) => {
    const history = useHistory()
    const [currentTab, setCurrentTab] = useState<CustomerStuffTab>(getCurrentTab(stuffId));

    const handleTabsChange = (event: React.ChangeEvent<{}>, tab: CargoStuffTab) => {
        setCurrentTab(tab)
        history.push(`${tabPath}/${tab.value}`);
    }

    return (
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
                <CustomerTabPanel index={'active-cargo'} value={currentTab}>
                    <CargoListView cargoStatus={'ACTIVE'} />
                </CustomerTabPanel>
                <CustomerTabPanel index={'received-cargo'} value={currentTab}>
                    <CargoListView cargoStatus={'ISSUED'}/>
                </CustomerTabPanel>
                <CustomerTabPanel index={'reconciliation-act'} value={currentTab}>
                    <ReconciliationActListView/>
                </CustomerTabPanel>
            </Card>
        </Box>
    );
}

export default Detail
