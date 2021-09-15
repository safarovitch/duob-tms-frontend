import React, {useEffect, useState,} from 'react';
import {
    Box,
    Card,
    IconButton,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from '@material-ui/core';
import {Edit as EditIcon, Trash as TrashIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {Driver} from "../../../model/Road";
import {setSelectedDriver} from "../../../store/actions/roadActions";
import roadService from "../../../services/RoadService";
import ConfirmModal from "../../../components/ConfirmModal";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import NoFoundTableBody from "../../../components/NoFoundTableBody";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const DriverListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [selectedDriver, selectDriver] = useState<Driver>();

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectDriver = (driver: Driver, needDispatch: boolean) => {
        selectDriver(driver);

        if (needDispatch) {
            dispatch(setSelectedDriver(driver))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteDriver = async (driverId: number) => {
        setOpen(false)
        setLoading(true)

        try {
            await roadService.deleteDriver(driverId);
            enqueueSnackbar(`Успешно удалено!`, {variant: 'success'})
            getDrivers().then(null)
            setPage(1)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    const getDrivers = async () => {
        setLoading(true)

        try {
            const result: any = await roadService.getFilteredDrivers(page, size)
            setDrivers(result.content)
            setTotal(result.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getDrivers().then(null)
    }, [page, size]);

    return (
        <Card
            className={classes.root}
        >
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Водитель
                                </TableCell>
                                <TableCell>
                                    Номер телефона
                                </TableCell>
                                <TableCell>
                                    Адрес проживание
                                </TableCell>
                                <TableCell align="center" width="12%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            drivers?.length > 0
                                ? drivers.map((driver: Driver) => (
                                    <TableBody>
                                        <TableRow
                                            hover
                                            key={driver.id}
                                        >
                                            <TableCell>
                                                {driver.name}
                                            </TableCell>
                                            <TableCell>
                                                {driver.phoneNumber}
                                            </TableCell>
                                            <TableCell>
                                                {driver.address}
                                            </TableCell>
                                            <TableCell align="center" width="12%">
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/road/driver/edit`}
                                                    onClick={() => handleSelectDriver(driver, true)}
                                                >
                                                    <SvgIcon fontSize="small">
                                                        <EditIcon/>
                                                    </SvgIcon>
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleSelectDriver(driver, false)}
                                                >
                                                    <SvgIcon fontSize="small">
                                                        <TrashIcon/>
                                                    </SvgIcon>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>)
                                )
                                : <NoFoundTableBody loading={loading}/>
                        }
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
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={'Вы уверены, что хотите удалить водителя?'}
                description={'При удалении водителя, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этого водителя.'}
                onClose={() => setOpen(false)}
                onAccept={() => handleDeleteDriver(selectedDriver?.id!!)}/>
        </Card>
    );
}

export default DriverListView;
