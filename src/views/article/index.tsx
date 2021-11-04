import {Box, Card, Container, Divider, makeStyles, Tab, Tabs} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {useParams} from "react-router";
import Page from "../../components/Page";
import React from "react";
import Header from "./Header";
import {articleStuffTabs as tabs} from '../../constants'
import {ArticleStuffTab} from "../../model/Article";
import ArticleTabPanel from "./ArticleTabPanel";
import IncomeListView from "./income/IncomeListView";
import OutcomeListView from "./outcome/OutcomeListView";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const a11yProps = (tab: ArticleStuffTab) => ({id: `article-tab-${tab.value}`, 'aria-controls': `article-tabpanel-${tab.value}`})

const getCurrentTab = (pathTab: string) => tabs.find(item => item.value === pathTab)

const ArticleStuffView: React.FC = () => {
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
            title={'Статьи'}
        >
            <Container maxWidth="md">
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
