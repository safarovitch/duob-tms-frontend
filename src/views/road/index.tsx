import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {useParams} from "react-router";
import Page from "../../components/Page";
import React from "react";
import Header from "./Header";
import {roadStuffTabs as tabs} from '../../constants'
import {RoadStuffTab} from "../../model/Road";
import RoadTabPanel from "./RoadTabPanel";
import DriverListView from "./driver/DriverListView";
import TruckListView from "./truck/TruckListView";
import TrailerListView from "./trailer/TrailerListView";
import TruckTypeListView from "./truck-type/TruckTypeListView";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const a11yProps = (tab: RoadStuffTab) => ({id: `road-tab-${tab.value}`, 'aria-controls': `road-tabpanel-${tab.value}`})

const getCurrentTab = (pathTab: string) => tabs.find(item => item.value === pathTab)

const RoadStuffView: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {stuffId: pathTab} = useParams<{ stuffId: string }>()
    const currentTab = getCurrentTab(pathTab)

    if (!currentTab) {
        history.go(-1)
        return null
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
                        <RoadTabPanel index={'driver'} value={currentTab}>
                            <DriverListView />
                        </RoadTabPanel>
                        <RoadTabPanel index={'truck'} value={currentTab}>
                            <TruckListView />
                        </RoadTabPanel>
                        <RoadTabPanel index={'trailer'} value={currentTab}>
                            <TrailerListView/>
                        </RoadTabPanel>
                        <RoadTabPanel index={'truck-type'} value={currentTab}>
                            <TruckTypeListView />
                        </RoadTabPanel>
                    </Card>

                </Box>
            </Container>
        </Page>
    );
}

export default RoadStuffView;
