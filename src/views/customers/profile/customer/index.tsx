import React, {useState} from 'react';
import {
    Box,
    Container,
    Divider,
    Tab,
    Tabs,
    makeStyles
} from '@material-ui/core';
import Page from '../../../../components/Page';
import Header from './Header';
import General from './General';
import Security from './Security';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function AccountView() {
    const classes = useStyles();
    const [currentTab, setCurrentTab] = useState('general');
    const tabs = [
        { value: 'general', label: 'Общее' },
        { value: 'security', label: 'Безопасность' }
    ];

    const handleTabsChange = (event: React.ChangeEvent<{}>, value: string) => {
        setCurrentTab(value);
    };

    return (
        <Page className={classes.root} title="Settings">
            <Container maxWidth="lg">
                <Header />
                <Box mt={3}>
                    <Tabs
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        value={currentTab}
                        variant="scrollable"
                        textColor="secondary"
                    >
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                            />
                        ))}
                    </Tabs>
                </Box>
                <Divider />
                <Box mt={3}>
                    {currentTab === 'general' && <General />}
                    {currentTab === 'security' && <Security />}
                </Box>
            </Container>
        </Page>
    );
}

export default AccountView;
