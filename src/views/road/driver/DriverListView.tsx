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
import {Driver} from "../../../model/Road";
import {setSelectedDriver} from "../../../store/actions/roadActions";
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
}));

const DriverListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0)
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<Driver[]>([]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                setRows([])

                const result: any = await roadService.getFilteredDrivers(page, size)
                setRows(result.content)
                setTotal(result.totalElements)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
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
                                    Водитель
                                </TableCell>
                                <TableCell>
                                    Номер телефона
                                </TableCell>
                                <TableCell>
                                    Адрес проживание
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows?.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: Driver, index) => (
                                        <TableRow
                                            hover
                                            key={row.id}
                                        >
                                            <TableCell>
                                                {row.name}
                                            </TableCell>
                                            <TableCell>
                                                {row.phoneNumber}
                                            </TableCell>
                                            <TableCell>
                                                {row.address}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/road/driver/edit`}
                                                    onClick={() => dispatch(setSelectedDriver(row))}
                                                >
                                                    <SvgIcon fontSize="small">
                                                        <EditIcon/>
                                                    </SvgIcon>
                                                </IconButton>
                                                <DeleteButton
                                                    index={index}
                                                    rowId={row.id!}
                                                    onDelete={roadService.deleteDriver}
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
    );
}

export default DriverListView;
