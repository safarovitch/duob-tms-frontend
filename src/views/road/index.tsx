import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router";
import Page from "../../components/Page";
import React, {useState} from "react";
import Header from "./Header";
import {roadStuffTabs as tabs} from '../../constants'
import {RoadStuffTab} from "../../model/Road";
import CargoTabPanel from "./CargoTabPanel";
import DriverListView from "./driver/DriverListView";
import TruckListView from "./truck/TruckListView";

const getCurrentTab = (stuffId: string) => {
    return tabs.filter(v => v.value === stuffId)[0];
}

const a11yProps = (tab: RoadStuffTab) => ({id: `road-tab-${tab.value}`, 'aria-controls': `road-tabpanel-${tab.value}`})

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const RoadStuffView: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {stuffId} = useParams<{ stuffId: string }>();
    const [currentTab, setCurrentTab] = useState<RoadStuffTab>(getCurrentTab(stuffId));

    const handleTabsChange = (event: React.ChangeEvent<{}>, tab: RoadStuffTab) => {
        setCurrentTab(tab)
        history.push('/app/road/' + tab.value);
    }

    return (
        <Page
            className={classes.root}
            title={'Константы рейса'}
        >
            <Container maxWidth="lg">

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
                        <CargoTabPanel index={'driver'} value={currentTab}>
                            <DriverListView />
                        </CargoTabPanel>
                        <CargoTabPanel index={'truck'} value={currentTab}>
                            <TruckListView />
                        </CargoTabPanel>
                        {/*<CargoTabPanel index={'type'} value={currentTab}>*/}
                        {/*    <CargoTypeListView/>*/}
                        {/*</CargoTabPanel>*/}
                        {/*<CargoTabPanel index={'tariff'} value={currentTab}>*/}
                        {/*    <CargoTariffListView/>*/}
                        {/*</CargoTabPanel>*/}
                    </Card>

                </Box>
            </Container>
        </Page>
    );
}

export default RoadStuffView;
