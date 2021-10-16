import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router";
import Page from "../../components/Page";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import {roadsStuffTabs as tabs} from '../../constants'
import {Road, RoadsStuffTab} from "../../model/Road";
import errorMessageHandler from "../../utils/errorMessageHandler";
import roadService from "../../services/RoadService";
import {useSnackbar} from "notistack";
import LoadingLayout from "../../components/LoadingLayout";
import RoadsTabPanel from "./RoadsTabPanel";
import RoadMain from "./RoadMain";
import RoadFuel from "./RoadFuel";
import RoadMileage from "./RoadMileage";
import RoadMoney from "./RoadMoney";
import RoadCargos from "./RoadCargos";

const getCurrentTab = (stuffId: string) => {
    return tabs.filter(v => v.value === stuffId)[0];
}

const a11yProps = (tab: RoadsStuffTab) => ({
    id: `roads-tab-${tab.value}`,
    'aria-controls': `roads-tabpanel-${tab.value}`
})

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const RoadsStuffView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const {id, stuffId} = useParams<{ stuffId: string, id: string }>()
    const [currentTab, setCurrentTab] = useState<RoadsStuffTab>(getCurrentTab(stuffId))
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [road, setRoad] = useState<Road>()

    useEffect(() => {
        getRoad().then(null)
    }, [])

    const getRoad = async () => {
        try {
            setLoading(true)

            const fetchRoad: any = await roadService.getRoadById(id)

            setRoad(fetchRoad)
        } catch (error: any) {
            setHasError(true)
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const handleTabsChange = (event: React.ChangeEvent<{}>, tab: RoadsStuffTab) => {
        setCurrentTab(tab)
        history.push(`/app/roads/${id}/${tab.value}`);
    }

    return (
        <Page title={`Рейс № ${id}`}>
            {
                road
                    ? (
                        <Container className={classes.root} maxWidth="lg">
                            <Header id={id} title={currentTab.label}/>
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
                                                disabled={road.privateTruck ? !tab.privateTruck : false}
                                                {...a11yProps(tab)}
                                            />
                                        ))}
                                    </Tabs>
                                    <Divider/>
                                    <RoadsTabPanel index={'main'} value={currentTab}>
                                        <RoadMain road={road} updateRoad={getRoad} />
                                    </RoadsTabPanel>
                                    <RoadsTabPanel index={'mileage'} value={currentTab}>
                                        <RoadMileage road={road} updateRoad={getRoad} />
                                    </RoadsTabPanel>
                                    <RoadsTabPanel index={'money'} value={currentTab}>
                                        <RoadMoney road={road} updateRoad={getRoad} />
                                    </RoadsTabPanel>
                                    <RoadsTabPanel index={'fuel'} value={currentTab}>
                                        <RoadFuel road={road} updateRoad={getRoad} />
                                    </RoadsTabPanel>
                                    <RoadsTabPanel index={'cargos'} value={currentTab}>
                                        <RoadCargos roadId={road.id!} />
                                    </RoadsTabPanel>
                                </Card>
                            </Box>
                        </Container>
                    )
                    : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    );
}

export default RoadsStuffView;
