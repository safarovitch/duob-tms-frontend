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
import {TruckType} from "../../../model/Road";
import {setSelectedTruckType} from "../../../store/actions/roadActions";
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

const TruckTypeListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [truckTypes, setTruckTypes] = useState<TruckType[]>([]);
    const [selectedTruckType, selectTruckType] = useState<TruckType>();

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectTruckType = (truckType: TruckType, needDispatch: boolean) => {
        selectTruckType(truckType);

        if (needDispatch) {
            dispatch(setSelectedTruckType(truckType))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteTruckType = async (truckTypeId: number) => {
        try {
            setOpen(false)
            setPage(1)

            await roadService.deleteTruckType(truckTypeId);

            enqueueSnackbar(`Успешно удалено!`, {variant: 'success'})
            getTruckTypes().then(null)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    };

    const getTruckTypes = async () => {
        try {
            setLoading(true)
            setTruckTypes([])

            const result: any = await roadService.getFilteredTruckTypes(page, size)
            setTruckTypes(result.content)
            setTotal(result.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getTruckTypes().then(null)
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
                                    Тип
                                </TableCell>
                                <TableCell>
                                    Норма отправки без груза
                                </TableCell>
                                <TableCell>
                                    Норма отправки с грузом
                                </TableCell>
                                <TableCell>
                                    Норма прицепа отправки
                                </TableCell>
                                <TableCell>
                                    Норма возврата без груза
                                </TableCell>
                                <TableCell>
                                    Норма возврата с грузом
                                </TableCell>
                                <TableCell>
                                    Норма возврата прицепа с грузом
                                </TableCell>
                                <TableCell align="center" width="12%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            truckTypes?.length > 0
                                ? (
                                    <TableBody>
                                        {truckTypes.map((truckType: TruckType) => (
                                            <TableRow
                                                hover
                                                key={truckType.id}
                                            >
                                                <TableCell>
                                                    {truckType.name}
                                                </TableCell>
                                                <TableCell>
                                                    {truckType.shippingNormWithoutCargo}
                                                </TableCell>
                                                <TableCell>
                                                    {truckType.shippingNormWithCargo}
                                                </TableCell>
                                                <TableCell>
                                                    {truckType.shippingNormTrailer}
                                                </TableCell>
                                                <TableCell>
                                                    {truckType.returnNormWithoutCargo}
                                                </TableCell>
                                                <TableCell>
                                                    {truckType.returnNormWithCargo}
                                                </TableCell>
                                                <TableCell>
                                                    {truckType.returnNormTrailerWithCargo}
                                                </TableCell>
                                                <TableCell align="center" width="12%">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/app/road/truck-type/edit`}
                                                        onClick={() => handleSelectTruckType(truckType, true)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <EditIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleSelectTruckType(truckType, false)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <TrashIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
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
                title={'Вы уверены, что хотите удалить тип машины?'}
                description={'При удалении тип машины, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этот тип машины.'}
                onClose={() => setOpen(false)}
                onAccept={() => handleDeleteTruckType(selectedTruckType?.id!!)}/>
        </Card>
    );
}

export default TruckTypeListView;
