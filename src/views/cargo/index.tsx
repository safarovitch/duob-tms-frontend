import React from "react";
import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {useParams} from "react-router";
import Page from "../../components/Page";
import Header from "./Header";
import {cargoStuffTabs as tabs} from '../../constants'
import {CargoStuffTab} from "../../model/Cargo";
import CargoTabPanel from "./CargoTabPanel";
import ProductListView from "./product/ProductListView";
import CustomCodeListView from "./customs/CustomCodeListView";
import CargoTypeListView from "./type/CargoTypeListView";
import CargoTariffListView from "./tariff/CargoTariffListView";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const a11yProps = (tab: CargoStuffTab) => ({id: `cargo-tab-${tab.value}`, 'aria-controls': `cargo-tabpanel-${tab.value}`})

const getCurrentTab = (pathTab: string) => tabs.find(item => item.value === pathTab)

function CargoStuffView() {
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
            title={'Константы груза'}
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
                        <CargoTabPanel index={'product'} value={currentTab}>
                            <ProductListView/>
                        </CargoTabPanel>
                        <CargoTabPanel index={'customs'} value={currentTab}>
                            <CustomCodeListView/>
                        </CargoTabPanel>
                        <CargoTabPanel index={'type'} value={currentTab}>
                            <CargoTypeListView/>
                        </CargoTabPanel>
                        <CargoTabPanel index={'tariff'} value={currentTab}>
                            <CargoTariffListView/>
                        </CargoTabPanel>
                    </Card>
                </Box>
            </Container>
        </Page>
    );
}

export default CargoStuffView;
