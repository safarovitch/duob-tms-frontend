import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Typography,
    useTheme,
    useMediaQuery,
    makeStyles
} from '@material-ui/core';
import Page from '../components/Page';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3),
        paddingTop: 80,
        paddingBottom: 80
    },
    image: {
        maxWidth: '100%',
        maxHeight: 600,
        height: 'auto'
    }
}));

function Error404View() {
    const classes = useStyles();
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Page
            className={classes.root}
            title="Нет такой страницы"
        >
            <Container maxWidth="lg">
                <Typography
                    align="center"
                    variant={mobileDevice ? 'h4' : 'h1'}
                    color="textPrimary"
                >
                    Ошибка 404. Нет такой страницы
                </Typography>
                <Box display="flex" justifyContent="center">
                    <img
                        alt="404"
                        className={classes.image}
                        src="/static/page_not_found.svg"
                    />
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                >
                    <Button
                        color="secondary"
                        component={RouterLink}
                        to="/"
                        variant="outlined"
                    >
                        На главную
                    </Button>
                </Box>
            </Container>
        </Page>
    );
}

export default Error404View;
