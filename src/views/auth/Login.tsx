import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Container,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Typography,
    makeStyles
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LockIcon from '@material-ui/icons/Lock';
import Page from '../../components/Page';
import LoginForm from './LoginForm';

const useStyles = makeStyles((theme) => ({
    root: {
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        minHeight: '100%',
        flexDirection: 'column',
        paddingBottom: 80,
        paddingTop: 80
    },
    backButton: {
        marginLeft: theme.spacing(2)
    },
    card: {
        overflow: 'visible',
        display: 'flex',
        position: 'relative',
        '& > *': {
            flexGrow: 1,
            flexBasis: '50%',
            width: '50%'
        }
    },
    content: {
        padding: theme.spacing(8, 4, 3, 4)
    },
    icon: {
        backgroundColor: "#03A075",
        color: theme.palette.common.white,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(1),
        position: 'absolute',
        top: -32,
        left: theme.spacing(3),
        height: 64,
        width: 64
    },
    logo: {
        color: theme.palette.common.white,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(1),
        height: 80,
        width: 80
    },
    media: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        padding: theme.spacing(3),
        color: theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
}));

function LoginView() {
    const classes = useStyles();
    const [failureMessage, setFailureMessage] = useState<string | null>(null)

    const handleSubmitFailure = (message: string) => {
        setFailureMessage(message)
    };

    return (
        <Page
            className={classes.root}
            title="Login"
        >
            <Container maxWidth="md">
                <Card className={classes.card}>
                    <CardContent className={classes.content}>
                        <Avatar className={classes.icon}>
                            <LockIcon fontSize="large" />
                        </Avatar>
                        <Typography
                            variant="h2"
                            color="textPrimary"
                        >
                            Авторизация
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                        >
                            Вход в систему DuobTMS
                        </Typography>
                        {failureMessage && (<Box mt={2}>
                            <Alert
                                severity="error"
                            >
                                <div>
                                    {failureMessage}
                                </div>
                            </Alert>
                        </Box>)}
                        <Box mt={3}>
                            <LoginForm onSubmitFailure={handleSubmitFailure} />
                        </Box>
                        <Box my={2}>
                            <Divider />
                        </Box>
                    </CardContent>
                    <CardMedia
                        className={classes.media}
                        image="/static/auth.png"
                        title="DuobTMS"
                    >
                        <Typography
                            color="inherit"
                            variant="h2"
                        >
                            DuobTMS
                        </Typography>
                    </CardMedia>
                </Card>
            </Container>
        </Page>
    );
}

export default LoginView;
