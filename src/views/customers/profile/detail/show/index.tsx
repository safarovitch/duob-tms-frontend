import React, {useEffect} from "react";
import {
    Box,
    Card,
    CardHeader,
    Container,
    Divider,
    Grid,
    makeStyles,
    Table,
    TableBody, TableCell, TableHead,
    TableRow
} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Header from "./Header";
import Page from "../../../../../components/Page";
import PerfectScrollbar from "react-perfect-scrollbar";
import {useDispatch, useSelector} from "react-redux";
import {CargoGeneral, CustomerCargo} from "../../../../../model/Customer";
import {deleteSelectedCustomerCargo} from "../../../../../store/actions/customerActions";
import {mapOfColorStatusCargo, mapOfStatusCargo, StatusCargoEnum} from "../../../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const CargoShow: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const customerCargo = useSelector((state: {selectedCustomerCargo: CustomerCargo}) => state.selectedCustomerCargo)

    useEffect(() => () => {
        dispatch(deleteSelectedCustomerCargo())
    }, [dispatch])

    if (!customerCargo) {
        history.go(-1);
        return null;
    }

    const getCargoDate = (cargo: CargoGeneral) => {
        switch (cargo.status) {
            case StatusCargoEnum.FORMALIZED: {
                return cargo.createdDate
            }
            case StatusCargoEnum.ARRIVED: {
                return cargo.arrivalDate
            }
            case StatusCargoEnum.ISSUED: {
                return cargo.dateOfIssue
            }
            case StatusCargoEnum.RETURNED: {
                return cargo.dateOfReturn
            }
            case StatusCargoEnum.ONROAD: {
                return '-'
            }
        }
    }

    return (
        <Page title={`Груз: ${customerCargo.productName}`}>
            <Container className={classes.root} maxWidth="xl">
                <Header customerCargo={customerCargo} />
                <Box mt={3}>
                    <Grid container spacing={3}>
                        <Grid item md={4} xl={3} xs={12}>
                            <Card>
                                <CardHeader title="Информация о грузе" />
                                <Divider />
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Наименование:</TableCell>
                                            <TableCell>{customerCargo.productName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Вид груза:</TableCell>
                                            <TableCell>{customerCargo.cargoTypeName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Д/Ш/В (м):</TableCell>
                                            <TableCell>{customerCargo.lengthCargo}/{customerCargo.widthCargo}/{customerCargo.heightCargo}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Объем(м3):</TableCell>
                                            <TableCell>{customerCargo.totalVolume}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Вес (кг):</TableCell>
                                            <TableCell>{customerCargo.totalWeight}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Стоимость (USD):</TableCell>
                                            <TableCell>{customerCargo.amount}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Card>
                        </Grid>
                        <Grid item md={8} xl={9} xs={12}>
                            <Card>
                                <CardHeader title="Грузы" />
                                <Divider />
                                <PerfectScrollbar>
                                    <Box minWidth={700}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>№</TableCell>
                                                    <TableCell>Статус</TableCell>
                                                    <TableCell>Дата операции</TableCell>
                                                    <TableCell>Просроченно дней</TableCell>
                                                    <TableCell>Стоимость хранения ($)</TableCell>
                                                    <TableCell>Текущая местоположение</TableCell>
                                                    <TableCell width="30%">Путь груза</TableCell>
                                                    <TableCell>Штрих-код</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {customerCargo.cargos!.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{++index}</TableCell>
                                                        <TableCell style={{color: mapOfColorStatusCargo.get(row.status)}}>
                                                            <b>{mapOfStatusCargo.get(row.status)}</b>
                                                        </TableCell>
                                                        <TableCell>{getCargoDate(row)}</TableCell>
                                                        <TableCell>{row.dueDays}</TableCell>
                                                        <TableCell>{row.storagePrice}</TableCell>
                                                        <TableCell>
                                                            {row.roadId && `Рейс ${row.roadId}`}
                                                            {row.warehouseId && `Склад ${row.warehouseId}`}
                                                        </TableCell>
                                                        <TableCell>{row.description}</TableCell>
                                                        <TableCell>{row.barcode}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                </PerfectScrollbar>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Page>
    )
}

export default CargoShow
