import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    Container,
    makeStyles, Table, TableBody, TableCell, TableHead, TableRow,
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
import PerfectScrollbar from "react-perfect-scrollbar";

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
                    <Container className={classes.root} maxWidth="xl">
                        <Header tariff={selectedTariff!} />
                        <Box mt={3}>
                            <Card>
                                <PerfectScrollbar>
                                    <Box minWidth={700}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Дата действия</TableCell>
                                                    <TableCell>Дата изменения</TableCell>
                                                    <TableCell>Сотрудник</TableCell>
                                                    <TableCell>Название тарифа</TableCell>
                                                    <TableCell>Филиал</TableCell>
                                                    <TableCell>Описание</TableCell>
                                                    <TableCell>Сумма</TableCell>
                                                    <TableCell>Цена за 1 м³ среднего предела</TableCell>
                                                    <TableCell>Цена за 1 кг - договорная</TableCell>
                                                    <TableCell>Цена за 1 кг - свыше среднего предела</TableCell>
                                                    <TableCell>Нижний предел массы в 1 м³</TableCell>
                                                    <TableCell>Средний предел массы в 1 м³</TableCell>
                                                    <TableCell>Верхний предел массы в 1 м³</TableCell>
                                                    <TableCell>Скидка нижнего предела</TableCell>
                                                    <TableCell>Скидка среднего предела</TableCell>
                                                    <TableCell>Норма кг в 1 м³</TableCell>
                                                    <TableCell>Максимальный вес 1 м³ в рейсе</TableCell>
                                                    <TableCell>Максимальная кубатура рейса</TableCell>
                                                    <TableCell>Максимальный вес рейса</TableCell>
                                                    <TableCell>Общий вес</TableCell>
                                                    <TableCell>Общий объем</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    cargoTariffs.map(row => (
                                                        <TableRow hover key={row.id}>
                                                            <TableCell>{row.createdDate}</TableCell>
                                                            <TableCell>{row.updatedDate}</TableCell>
                                                            <TableCell>{row.updatedBy}</TableCell>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row.warehouseDto?.name}</TableCell>
                                                            <TableCell>{row.description}</TableCell>
                                                            <TableCell>{row.totalPrice}</TableCell>
                                                            <TableCell>{row.cubedPrice}</TableCell>
                                                            <TableCell>{row.kgNegotiatedPrice}</TableCell>
                                                            <TableCell>{row.kgPrice}</TableCell>
                                                            <TableCell>{row.bottomMassInCube}</TableCell>
                                                            <TableCell>{row.middleMassInCube}</TableCell>
                                                            <TableCell>{row.topMassInCube}</TableCell>
                                                            <TableCell>{row.bottomDiscount}</TableCell>
                                                            <TableCell>{row.middleDiscount}</TableCell>
                                                            <TableCell>{row.kgNormInCube}</TableCell>
                                                            <TableCell>{row.maxRoadMassInCube}</TableCell>
                                                            <TableCell>{row.maxRoadCube}</TableCell>
                                                            <TableCell>{row.maxRoadMass}</TableCell>
                                                            <TableCell>{row.totalMass}</TableCell>
                                                            <TableCell>{row.totalCube}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </Box>
                                </PerfectScrollbar>
                            </Card>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    )
}

export default Index