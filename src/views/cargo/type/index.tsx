import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import CargoTypeForm from "./CargoTypeForm";
import {useSelector} from "react-redux";
import {CargoType} from "../../../model/Cargo";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const Index: React.FC = () => {
    const classes = useStyles();
    const cargoType = useSelector((state: { selectedCargoType: CargoType }) => state.selectedCargoType);
    const history = useHistory();

    if (!cargoType && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page
            className={classes.root}
            title={'Вид груза'}
        >
            <Container maxWidth="md">
                <Header cargoType={cargoType}/>
                <Box mt={3}>
                    <CargoTypeForm cargoType={cargoType}/>
                </Box>
            </Container>
        </Page>
    );
}

export default Index;
