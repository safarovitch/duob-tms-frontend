import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardHeader,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import {useSnackbar} from "notistack";
import warehouseService from "../../../services/WarehouseService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useParams} from "react-router";
import {WarehouseStateCargo} from "../../../model/Warehouse";
import Page from "../../../components/Page";
import LoadingLayout from "../../../components/LoadingLayout";
import Header from "./Header";
import {mapOfColorStatusCargo, mapOfStatusCargo} from "../../../constants";
import DoneIcon from "@material-ui/icons/Done";
import {NavLink as RouterLink} from "react-router-dom";
import {Edit as EditIcon} from "react-feather";
import usePermission from "../../../hooks/usePermission";
import PERMISSIONS from "../../../constants/permissions";

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
    const {enqueueSnackbar} = useSnackbar()
    const {id: cargoId} = useParams<{id: string}>()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [cargos, setCargos] = useState<WarehouseStateCargo[]>([])
    const [selectedCargo, setSelectCargo] = useState<WarehouseStateCargo>()
    const isAdmin = usePermission(PERMISSIONS.ADMIN)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const dataCargos: any = await warehouseService.getWarehouseStateCargo(Number(cargoId))

                if (dataCargos.length === 0) throw new Error("Не найдено")

                if (!cancel) {
                    setCargos(dataCargos)
                    setSelectCargo(dataCargos[0])
                }
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, cargoId])

    return (
        <Page title={selectedCargo ? `Груз: ${selectedCargo.productName}` : 'Груз'}>
            {
                cargos.length > 0 && selectedCargo ? (
                    <Container className={classes.root} maxWidth="xl">
                        <Header cargo={selectedCargo} />
                        <Box mt={3}>
                            {
                                cargos.length > 1 && (
                                    <Box pb={3} px={2}>
                                        <Grid container spacing={2}>
                                            {cargos.map((cargo, index) => (
                                                <Grid item key={index}>
                                                    {selectedCargo.syncDate === cargo.syncDate ? (
                                                        <Chip
                                                            label={cargo.date}
                                                            clickable
                                                            color="primary"
                                                            onDelete={() => null}
                                                            deleteIcon={<DoneIcon />}
                                                        />
                                                    ) : (
                                                        <Chip
                                                            label={cargo.date}
                                                            clickable
                                                            onClick={() => setSelectCargo(cargo)}
                                                        />
                                                    )}
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )
                            }
                            <Grid container spacing={3}>
                                <Grid item md={4} xl={3} xs={12}>
                                    <Card>
                                        <Grid container justifyContent="space-between" alignItems="center">
                                            <Grid item>
                                                <CardHeader title="Информация о грузе" />
                                            </Grid>
                                            {
                                                isAdmin && (
                                                    <Grid item>
                                                        <Box p={1}>
                                                            <IconButton component={RouterLink} to={`/app/cargos/${selectedCargo.id}/edit`}>
                                                                <SvgIcon fontSize="small">
                                                                    <EditIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                )
                                            }
                                        </Grid>
                                        <Divider />
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Клиент:</TableCell>
                                                    <TableCell>{selectedCargo.clientCode}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Наименование:</TableCell>
                                                    <TableCell>{selectedCargo.productName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Вид груза:</TableCell>
                                                    <TableCell>{selectedCargo.cargoTypeName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Д / Ш / В (м):</TableCell>
                                                    <TableCell>{selectedCargo.lengthCargo} / {selectedCargo.widthCargo} / {selectedCargo.heightCargo}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Объем(м3):</TableCell>
                                                    <TableCell>{selectedCargo.totalVolume}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Вес (кг):</TableCell>
                                                    <TableCell>{selectedCargo.totalWeight}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Стоимость (USD):</TableCell>
                                                    <TableCell>{selectedCargo.amount}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Завсклад:</TableCell>
                                                    <TableCell>{selectedCargo.updatedBy || selectedCargo.createdBy}</TableCell>
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
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>№</TableCell>
                                                            <TableCell>Статус</TableCell>
                                                            <TableCell>Дата</TableCell>
                                                            <TableCell>Просроченно дней</TableCell>
                                                            <TableCell>Стоимость хранения ($)</TableCell>
                                                            <TableCell width="30%">Путь груза</TableCell>
                                                            <TableCell>Штрих-код</TableCell>
                                                            <TableCell />
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {selectedCargo.cargos.map((row, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{++index}</TableCell>
                                                                <TableCell style={{color: mapOfColorStatusCargo.get(row.status)}}>
                                                                    <b>{mapOfStatusCargo.get(row.status)}</b>
                                                                </TableCell>
                                                                <TableCell>{row.updatedDate}</TableCell>
                                                                <TableCell>{row.dueDays}</TableCell>
                                                                <TableCell>{row.storagePrice}</TableCell>
                                                                <TableCell>{row.description}</TableCell>
                                                                <TableCell>{row.barcode}</TableCell>
                                                                <TableCell>
                                                                    {row.deleted && (
                                                                        <b style={{color: "red"}}>Удалено</b>
                                                                    )}
                                                                </TableCell>
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
                ) : <LoadingLayout loading={loading} hasError={hasError}/>
            }
        </Page>
    )
}

export default CargoShow
