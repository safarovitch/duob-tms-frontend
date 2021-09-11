import React, {
    useState,
    useEffect,
} from 'react';
import {
    Box, Card, CircularProgress, IconButton,
    makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow,
} from '@material-ui/core';
import {Edit as EditIcon, Trash as TrashIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {Truck} from "../../../model/Road";
import {setSelectedTruck} from "../../../store/actions/roadActions";
import roadService from "../../../services/RoadService";
import ConfirmModal from "../../../components/ConfirmModal";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    tableProgressBoxStyle: {position: 'relative', pointerEvents: 'none', backgroundColor: '#00000005'},
    tableProgress: {
        color: "secondary",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
    }
}));

const TruckListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [selectedTruck, selectTruck] = useState<Truck>();

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectTruck = (truck: Truck, needDispatch: boolean) => {
        selectTruck(truck);

        if (needDispatch) {
            dispatch(setSelectedTruck(truck))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteTruck = async (truckId: number) => {
        setOpen(false)
        setLoading(true)

        try {
            await roadService.deleteTruck(truckId);
            enqueueSnackbar(`Успешно удалено!`, {variant: 'success'})
            getTrucks().then(null)
            setPage(1)
        } catch (error) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    const getTrucks = async () => {
        setLoading(true)

        try {
            const result: any = await roadService.getFilteredTrucks(page, size)
            setTrucks(result.content)
            setTotal(result.totalElements)
        } catch (error) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getTrucks().then(null)
    }, [page, size]);

    return (
        <>
            {loading && (<CircularProgress size={48} className={classes.tableProgress}/>)}
            {trucks?.length > 0 && (
                <>
                    <Card
                        className={classes.root}
                    >
                        <PerfectScrollbar>
                            <Box minWidth={700} className={loading ? classes.tableProgressBoxStyle : ''}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Вид машины
                                            </TableCell>
                                            <TableCell>
                                                Объём бака (л)
                                            </TableCell>
                                            <TableCell>
                                                Грузо подъёмность (кг)
                                            </TableCell>
                                            <TableCell>
                                                Номер машины
                                            </TableCell>
                                            <TableCell>
                                                Общий объём кузова (м3)
                                            </TableCell>
                                            <TableCell>
                                                Остаток бака
                                            </TableCell>
                                            <TableCell align="center" width="12%">
                                                Действия
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {trucks.map((truck: Truck) => {

                                            return (
                                                <TableRow
                                                    hover
                                                    key={truck.id}
                                                >
                                                    <TableCell>
                                                        {truck.truckType}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truck.tankCapacity}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truck.liftingCapacity}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truck.truckNumber}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truck.totalBodyCapacity}
                                                    </TableCell>
                                                    <TableCell>
                                                        {truck.residueOfTank}
                                                    </TableCell>
                                                    <TableCell align="center" width="12%">
                                                        <IconButton
                                                            component={RouterLink}
                                                            to={`/app/road/truck/edit`}
                                                            onClick={() => handleSelectTruck(truck, true)}
                                                        >
                                                            <SvgIcon fontSize="small">
                                                                <EditIcon/>
                                                            </SvgIcon>
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleSelectTruck(truck, false)}
                                                        >
                                                            <SvgIcon fontSize="small">
                                                                <TrashIcon/>
                                                            </SvgIcon>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        </PerfectScrollbar>
                        <TablePagination
                            component="div"
                            count={total}
                            onPageChange={handlePageChange}
                            page={page - 1}
                            labelRowsPerPage={'Строк на странице:'}
                            rowsPerPage={size}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                        />
                    </Card>
                    <ConfirmModal
                        isOpen={isConfirmModalOpen}
                        title={'Вы уверены, что хотите удалить машину?'}
                        description={'При удалении машины, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно эту машину.'}
                        onClose={() => setOpen(false)}
                        onAccept={() => handleDeleteTruck(selectedTruck?.id!!)} />
                </>
            )}
        </>
    );
}

export default TruckListView;
