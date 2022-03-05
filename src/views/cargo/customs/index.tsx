import {Box, Container, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Page from "../../../components/Page";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import {useSelector} from "react-redux";
import {CargoCustomCode, CargoProduct} from "../../../model/Cargo";
import CustomCodeForm from "./CustomCodeForm";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import cargoService from "../../../services/CargoService";
import LoadingLayout from "../../../components/LoadingLayout";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const Index: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [products, setProducts] = useState<CargoProduct[]>([])
    const customCode = useSelector((state: { selectedCustomCode: CargoCustomCode }) => state.selectedCustomCode)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await cargoService.getOptionProducts()

                if (data.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала наименования', {variant: 'info'})
                } else if (!cancel) setProducts(data)
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [history, enqueueSnackbar])

    if (!customCode && history.location.pathname.includes('edit')) {
        history.go(-1);
        return null;
    }

    return (
        <Page title={'Томоженный код'}>
            {
                products.length > 0 ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Header customCode={customCode}/>
                        <Box mt={3}>
                            <CustomCodeForm customCode={customCode} products={products} />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default Index;
