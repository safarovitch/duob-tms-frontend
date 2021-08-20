import React, {useEffect, useState} from 'react';
import {
    Box,
    Container,
    Divider,
    Tab,
    Tabs,
    makeStyles, Button
} from '@material-ui/core';
import Page from '../../components/Page';
import Header from './Header';
import General from './General';
import Security from './Security';
import employeeService from "../../services/EmployeeService";
import {Employee} from "../../model/Employee";
import {useSnackbar} from "notistack";

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
    const {enqueueSnackbar} = useSnackbar();
    const [currentTab, setCurrentTab] = useState('general');
    const [employee, setEmployee] = useState<Employee>();
    const tabs = [
        { value: 'general', label: 'Общее' },
        { value: 'security', label: 'Безопасность' }
    ];

    useEffect(() => {
        getEmployee().then(null)
    }, [])

    const getEmployee = async () => {
        try {
            const employee: any = await employeeService.getEmployee();
            setEmployee(employee);
        } catch (error) {
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getEmployee()}>Рестарт</Button>
            });
        }
    }

    const handleTabsChange = (event: React.ChangeEvent<{}>, value: string) => {
        setCurrentTab(value);
    };

    return (
        <Page
            className={classes.root}
            title="Settings"
        >
            <Container maxWidth="lg">
                <Header />
                {employee && (
                    <>
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
                            {currentTab === 'general' && <General employee={employee} getEmployee={getEmployee} />}
                            {currentTab === 'security' && <Security />}
                        </Box>
                    </>
                )}
            </Container>
        </Page>
    );
}

export default AccountView;
