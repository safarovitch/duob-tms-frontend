import React, {useEffect, useReducer, useState,} from 'react';
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
import {Edit as EditIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {Truck} from "../../../model/Road";
import {setSelectedTruck} from "../../../store/actions/roadActions";
import roadService from "../../../services/RoadService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import DeleteButton from "../../../components/DeleteButton";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}))

const TruckListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0)
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<Truck[]>([]);

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await roadService.getFilteredTrucks(page, size)

                if (!cancel) {
                    setRows(data.content)
                    setTotal(data.totalElements)
                }
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [updateRows, enqueueSnackbar, page, size]);

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleDeleteRow = () => {
        setPage(1)
        setUpdateRows()
    };

    return (
        <Card className={classes.root}>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Модель
                                </TableCell>
                                <TableCell>
                                    Машина
                                </TableCell>
                                <TableCell>
                                    Прицеп
                                </TableCell>
                                <TableCell>
                                    Водитель
                                </TableCell>
                                <TableCell>
                                    Масса
                                </TableCell>
                                <TableCell>
                                    Грузо подъёмность (кг)
                                </TableCell>
                                <TableCell>
                                    Общий объём кузова (м3)
                                </TableCell>
                                <TableCell>
                                    Объём бака (л)
                                </TableCell>
                                <TableCell>
                                    Остаток топлива в баке
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows?.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: Truck, index) => (
                                        <TableRow
                                            hover
                                            key={row.id}
                                        >
                                            <TableCell>
                                                {row.model}
                                            </TableCell>
                                            <TableCell>
                                                {row.number}
                                            </TableCell>
                                            <TableCell>
                                                {row.trailer?.number || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {row.driver?.name || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {row.weight}
                                            </TableCell>
                                            <TableCell>
                                                {row.liftingCapacity}
                                            </TableCell>
                                            <TableCell>
                                                {row.totalBodyCapacity}
                                            </TableCell>
                                            <TableCell>
                                                {row.tankCapacity}
                                            </TableCell>
                                            <TableCell>
                                                {row.residueOfTank}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/road/truck/edit`}
                                                    onClick={() => dispatch(setSelectedTruck(row))}
                                                >
                                                    <SvgIcon fontSize="small">
                                                        <EditIcon/>
                                                    </SvgIcon>
                                                </IconButton>
                                                <DeleteButton
                                                    index={index}
                                                    rowId={row.id!}
                                                    onDelete={roadService.deleteTruck}
                                                    handleDelete={handleDeleteRow}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            ) : <NoFoundTableBody loading={loading}/>
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
        </Card>
    )
}

export default TruckListView;
