import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router";
import Page from "../../components/Page";
import React, {useState} from "react";
import Header from "./Header";
import {articleStuffTabs as tabs} from '../../constants'
import {ArticleStuffTab} from "../../model/Article";
import ArticleTabPanel from "./ArticleTabPanel";
import IncomeListView from "./income/IncomeListView";
import OutcomeListView from "./outcome/OutcomeListView";

const getCurrentTab = (stuffId: string) => {
    return tabs.filter(v => v.value === stuffId)[0];
}

const a11yProps = (tab: ArticleStuffTab) => ({id: `road-tab-${tab.value}`, 'aria-controls': `road-tabpanel-${tab.value}`})

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const ArticleStuffView: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {stuffId} = useParams<{ stuffId: string }>();
    const [currentTab, setCurrentTab] = useState<ArticleStuffTab>(getCurrentTab(stuffId));

    const handleTabsChange = (event: React.ChangeEvent<{}>, tab: ArticleStuffTab) => {
        setCurrentTab(tab)
        history.push('/app/article/' + tab.value);
    }

    return (
        <Page
            className={classes.root}
            title={'Статьи'}
        >
            <Container maxWidth="md">

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
                        <ArticleTabPanel index={'income'} value={currentTab}>
                            <IncomeListView />
                        </ArticleTabPanel>
                        <ArticleTabPanel index={'outcome'} value={currentTab}>
                            <OutcomeListView />
                        </ArticleTabPanel>
                    </Card>

                </Box>
            </Container>
        </Page>
    );
}

export default ArticleStuffView;
