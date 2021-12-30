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
    TableRow,
} from '@material-ui/core';
import {Edit as EditIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import exchangeService from "../../services/ExchangeService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import NoFoundTableBody from "../../components/NoFoundTableBody";
import DeleteButton from "../../components/DeleteButton";
import {Exchange} from "../../model/Exchange";
import {Currency, currencyMap} from "../../constants";
import {setSelectedExchange} from "../../store/actions/exchangeActions";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const ExchangeListView: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0);
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<Exchange[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await exchangeService.getAllExchanges()

                !cancel && setRows(data)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [updateRows, enqueueSnackbar]);

    const handleDeleteRow = () => {
        setUpdateRows()
    };

    return (
        <Card className={classes.root}>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Наименование</TableCell>
                                <TableCell>Курс</TableCell>
                                <TableCell align="center" width="15%">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows?.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: Exchange, index) => (
                                        <TableRow hover key={row.currency}>
                                            <TableCell><b>1</b> {currencyMap.get(Currency.USD)}</TableCell>
                                            <TableCell><b>{row.currency}</b>{" " + currencyMap.get(row.unit)}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/exchange/edit`}
                                                    onClick={() => dispatch(setSelectedExchange(row))}
                                                >
                                                    <SvgIcon fontSize="small">
                                                        <EditIcon/>
                                                    </SvgIcon>
                                                </IconButton>
                                                <DeleteButton
                                                    index={index}
                                                    rowId={row.id!}
                                                    onDelete={exchangeService.deleteExchange}
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
        </Card>
    );
}

export default ExchangeListView;
