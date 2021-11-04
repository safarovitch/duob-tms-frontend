import React, {useEffect, useReducer, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {useParams} from "react-router";
import {useSnackbar} from "notistack";
import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import Page from "../../components/Page";
import Header from "./Header";
import {roadsStuffTabs as tabs} from '../../constants'
import {Road, RoadsStuffTab} from "../../model/Road";
import errorMessageHandler from "../../utils/errorMessageHandler";
import roadService from "../../services/RoadService";
import LoadingLayout from "../../components/LoadingLayout";
import RoadsTabPanel from "./RoadsTabPanel";
import RoadMain from "./RoadMain";
import RoadFuel from "./RoadFuel";
import RoadMileage from "./RoadMileage";
import RoadMoney from "./RoadMoney";
import RoadCargos from "./RoadCargos";
import FuelDetailList from "./fuel-detail/FuelDetailList";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const a11yProps = (tab: RoadsStuffTab) => ({id: `article-tab-${tab.value}`, 'aria-controls': `article-tabpanel-${tab.value}`})

const getCurrentTab = (pathTab: string) => tabs.find(item => item.value === pathTab)

const RoadsStuffView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [updateRoad, setUpdateRoad] = useReducer(x => x + 1, 0)
    const {id: roadId, stuffId: pathTab} = useParams<{ stuffId: string, id: string }>()
    const currentTab = getCurrentTab(pathTab)
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [road, setRoad] = useState<Road>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await roadService.getRoadById(roadId)

                !cancel && setRoad(data)
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [updateRoad, enqueueSnackbar, roadId])

    if (!currentTab) {
        history.go(-1)
        return null
    }

    return (
        <Page title={`Рейс № ${roadId}`}>
            {
                road ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Header id={roadId} title={currentTab.label}/>
                        <Box mt={3}>
                            <Card>
                                <Tabs
                                    scrollButtons="auto"
                                    textColor="secondary"
                                    value={currentTab.value}
                                    variant="scrollable"
                                >
                                    {tabs.map((tab) => (
                                        <Tab
                                            key={tab.value}
                                            value={tab.value}
                                            label={tab.label}
                                            to={tab.value}
                                            component={Link}
                                            disabled={road.privateTruck ? !tab.privateTruck : false}
                                            {...a11yProps(tab)}
                                        />
                                    ))}
                                </Tabs>
                                <Divider/>
                                <RoadsTabPanel index={'main'} value={currentTab}>
                                    <RoadMain road={road} updateRoad={setUpdateRoad} />
                                </RoadsTabPanel>
                                <RoadsTabPanel index={'mileage'} value={currentTab}>
                                    <RoadMileage road={road} updateRoad={setUpdateRoad} />
                                </RoadsTabPanel>
                                <RoadsTabPanel index={'money'} value={currentTab}>
                                    <RoadMoney road={road} updateRoad={setUpdateRoad} />
                                </RoadsTabPanel>
                                <RoadsTabPanel index={'fuel'} value={currentTab}>
                                    <RoadFuel road={road} />
                                </RoadsTabPanel>
                                <RoadsTabPanel index={'cargos'} value={currentTab}>
                                    <RoadCargos roadId={road.id!} />
                                </RoadsTabPanel>
                                <RoadsTabPanel index={'on-base'} value={currentTab}>
                                    <FuelDetailList updateRoad={setUpdateRoad} type="ON_BASE" />
                                </RoadsTabPanel>
                                <RoadsTabPanel index={'on-road'} value={currentTab}>
                                    <FuelDetailList updateRoad={setUpdateRoad} type="ON_ROAD" />
                                </RoadsTabPanel>
                                <RoadsTabPanel index={'additional-outcome'} value={currentTab}>
                                    <FuelDetailList updateRoad={setUpdateRoad} type="ADDITIONAL_OUTCOME" />
                                </RoadsTabPanel>
                            </Card>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    );
}

export default RoadsStuffView;
