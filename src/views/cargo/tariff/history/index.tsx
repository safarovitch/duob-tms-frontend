import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent, Chip,
    Container,
    Grid,
    makeStyles,
    TextField
} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useSnackbar} from "notistack";
import {CargoTariff} from "../../../../model/Cargo";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import cargoService from "../../../../services/CargoService";
import {useParams} from "react-router";
import Page from "../../../../components/Page";
import LoadingLayout from "../../../../components/LoadingLayout";
import Header from "./Header";
import DoneIcon from "@material-ui/icons/Done";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const Index: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [cargoTariffs, setCargoTariffs] = useState<CargoTariff[]>([])
    const [selectedTariff, setSelectedTariff] = useState<CargoTariff>()
    const {id: cargoTariffId} = useParams<{id: string}>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await cargoService.getHistoryCargoTariff(Number(cargoTariffId));

                if (!cancel) {
                    setCargoTariffs(data)
                    setSelectedTariff(data[0])
                }
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [history, enqueueSnackbar, cargoTariffId])

    return (
        <Page title={'Тариф ' + (selectedTariff ? selectedTariff.name : '')}>
            {
                cargoTariffs.length > 0 && selectedTariff ? (
                    <Container className={classes.root} maxWidth="lg">
                        <Header tariff={selectedTariff!} />
                        <Box mt={3}>
                            {
                                cargoTariffs.length > 1 && (
                                    <Box pb={3}>
                                        <Grid container spacing={2}>
                                            {cargoTariffs.map((cargoTariff, index) => (
                                                <Grid item key={index}>
                                                    {selectedTariff.id === cargoTariff.id ? (
                                                        <Chip
                                                            label={index === 0 ? "Активный" : cargoTariff.updatedDate}
                                                            clickable
                                                            color="primary"
                                                            onDelete={() => null}
                                                            deleteIcon={<DoneIcon />}
                                                        />
                                                    ) : (
                                                        <Chip
                                                            label={index === 0 ? "Активный" : cargoTariff.updatedDate}
                                                            clickable
                                                            onClick={() => setSelectedTariff(cargoTariff)}
                                                        />
                                                    )}
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )
                            }
                            <Card>
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}
                                    >
                                        <Grid
                                            item
                                            md={12}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Название тарифа"
                                                value={selectedTariff.name}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={12}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Филиал"
                                                value={selectedTariff.warehouseDto?.name}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={6}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Описание"
                                                value={selectedTariff.description}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={6}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Сумма"
                                                value={selectedTariff.totalPrice}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Цена за 1 м³ среднего предела"
                                                value={selectedTariff.cubedPrice}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Цена за 1 кг - договорная"
                                                value={selectedTariff.kgNegotiatedPrice}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Цена за 1 кг - свыше среднего предела"
                                                value={selectedTariff.kgPrice}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Нижний предел массы в 1 м³"
                                                value={selectedTariff.bottomMassInCube}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Средний предел массы в 1 м³"
                                                value={selectedTariff.middleMassInCube}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Верхний предел массы в 1 м³"
                                                value={selectedTariff.topMassInCube}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Скидка нижнего предела"
                                                value={selectedTariff.bottomDiscount}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Скидка среднего предела"
                                                value={selectedTariff.middleDiscount}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Норма кг в 1 м³"
                                                value={selectedTariff.kgNormInCube}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Максимальный вес 1 м³ в рейсе"
                                                value={selectedTariff.maxRoadMassInCube}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Максимальная кубатура рейса"
                                                value={selectedTariff.maxRoadCube}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Максимальный вес рейса"
                                                value={selectedTariff.maxRoadMass}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Общий вес"
                                                value={selectedTariff.totalMass}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Общий объем"
                                                value={selectedTariff.totalCube}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    )
}

export default Index