import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {createStyles, makeStyles, StylesProvider, ThemeProvider} from "@material-ui/core";
import ScrollReset from "./components/ScrollReset";
import useSettings from "./hooks/useSettings";
import {createTheme} from "./theme";
import Routes from "./routes";
import Auth from "./components/Auth";
import {SnackbarProvider} from "notistack";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/ru";

const useStyles = makeStyles(() => createStyles({
    '@global': {
        '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0
        },
        html: {
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale',
            height: '100%',
            width: '100%'
        },
        body: {
            height: '100%',
            width: '100%'
        },
        '#root': {
            height: '100%',
            width: '100%'
        }
    }
}));

function App() {
    useStyles();

    const {settings} = useSettings();

    return (
        <ThemeProvider theme={createTheme(settings)}>
            <StylesProvider>
                <MuiPickersUtilsProvider locale="ru" utils={MomentUtils}>
                <SnackbarProvider maxSnack={1} autoHideDuration={2000}>
                    <BrowserRouter>
                        <Auth>
                            <ScrollReset/>
                            <Routes/>
                        </Auth>
                    </BrowserRouter>
                </SnackbarProvider>
                </MuiPickersUtilsProvider>
            </StylesProvider>
        </ThemeProvider>
    );
}

export default App;
