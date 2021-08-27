import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import {useSelector} from "react-redux";
import {CargoCustomCode} from "../../../model/Cargo";
import CustomCodeForm from "./CustomCodeForm";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function CargoProductView() {
    const classes = useStyles();
    const customCode = useSelector((state: { selectedCustomCode: CargoCustomCode }) => state.selectedCustomCode);
    const history = useHistory();
    if (!customCode && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page
            className={classes.root}
            title={'Томоженный код'}
        >
            <Container maxWidth="lg">

                <Header customCode={customCode}/>

                <Box mt={3}>
                    <CustomCodeForm customCode={customCode}/>
                </Box>
            </Container>
        </Page>
    );
}

export default CargoProductView;
