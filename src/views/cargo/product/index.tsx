import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React from "react";
import Header from "./Header";
import ProductForm from "./ProductForm";
import {useSelector} from "react-redux";
import {CargoProduct} from "../../../model/Cargo";

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
    const product = useSelector((state: { selectedProduct: CargoProduct }) => state.selectedProduct);
    const history = useHistory();
    if (!product && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page
            className={classes.root}
            title={'Наименование груза'}
        >
            <Container maxWidth="lg">

                <Header product={product}/>

                <Box mt={3}>
                    <ProductForm product={product}/>
                </Box>
            </Container>
        </Page>
    );
}

export default CargoProductView;
