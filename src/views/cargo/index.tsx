import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import Page from "../../components/Page";
import React, {useState} from "react";
import Header from "./Header";
import {cargoStuffTabs as tabs} from '../../constants'
import {CargoStuffTab} from "../../model/Cargo";
import CargoTabPanel from "./CargoTabPanel";
import ProductListView from "./product/ProductListView";
import CustomCodeListView from "./customs/CustomCodeListView";

function getCurrentTab(stuffId: string) {
    return tabs.filter(v => v.value === stuffId)[0];
}
function a11yProps(tab: CargoStuffTab) {
    return {
        id: `cargo-tab-${tab.value}`,
        'aria-controls': `cargo-tabpanel-${tab.value}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function CargoStuffView() {
    const classes = useStyles();
    const history = useHistory();
    const {stuffId} = useParams<{ stuffId: string }>();
    const [currentTab, setCurrentTab] = useState<CargoStuffTab>(getCurrentTab(stuffId));

    const handleTabsChange = (event: React.ChangeEvent<{}>, tab: CargoStuffTab) => {
        setCurrentTab(tab)
        history.push('/app/cargo/'+tab.value);
    }

    return (
        <Page
            className={classes.root}
            title={'Константы груза'}
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
                        <CargoTabPanel index={'product'} value={currentTab}>
                            <ProductListView/>
                        </CargoTabPanel>
                        <CargoTabPanel index={'customs'} value={currentTab}>
                            <CustomCodeListView/>
                        </CargoTabPanel>
                        <CargoTabPanel index={'type'} value={currentTab}>
                            Privet type
                        </CargoTabPanel>
                        <CargoTabPanel index={'tariff'} value={currentTab}>
                            Privet tariff
                        </CargoTabPanel>
                    </Card>

                </Box>
            </Container>
        </Page>
    );
}

export default CargoStuffView;
