import React, {useEffect, useState} from "react";
import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import Header from "./Header";
import CreateOrEditForm from "./CreateOrEditForm";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import LoadingLayout from "../../../components/LoadingLayout";
import warehouseService from "../../../services/WarehouseService";
import {Warehouse} from "../../../model/Warehouse";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function Index() {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const data: any = await warehouseService.getAllWarehouse()

                if (data.length === 0) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала склад', {variant: 'info'})
                } else setWarehouses(data)
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <Page title={'Перевод денег'}>
            {warehouses.length > 0
                ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header/>
                        <Box mt={3}>
                            <CreateOrEditForm warehouses={warehouses} />
                        </Box>
                    </Container>
                )
                : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default Index;
