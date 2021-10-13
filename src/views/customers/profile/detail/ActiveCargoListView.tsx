import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import {CustomerCargo} from "../../../../model/Customer";
import customerService from "../../../../services/CustomerService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useParams} from "react-router";
import {useDispatch} from "react-redux";
import NoFoundTableBody from "../../../../components/NoFoundTableBody";
import {useHistory} from "react-router-dom";
import {setSelectedCustomerCargo} from "../../../../store/actions/customerActions";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 500
    },
    tableProgressBoxStyle: {position: 'relative', pointerEvents: 'none', backgroundColor: '#00000005'},
    tableProgress: {
        color: "secondary",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));

const ActiveCargoListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const dispatch = useDispatch()
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(5)
    const [rows, setRows] = useState<CustomerCargo[]>([])
    const [loading, setLoading] = useState(false)
    const {id} = useParams<{id: string}>()

    useEffect(() => {
        getRows().then(null)
    }, [page, size])

    const getRows = async () => {
        try {
            setLoading(true)
            setRows([])

            const data: any = await customerService.getActiveCargos(id, page, size)
            setRows(data.content)
            setTotal(data.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    return rows && (
        <Card className={classes.root}>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Груз</TableCell>
                                <TableCell>Вид груза</TableCell>
                                <TableCell>Номер рейса</TableCell>
                                <TableCell>Д/Ш/В</TableCell>
                                <TableCell>Обьем(м3)</TableCell>
                                <TableCell>Вес(кг)</TableCell>
                                <TableCell>Стоимост $</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Просроченно дней</TableCell>
                                <TableCell>Штрих-код</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: CustomerCargo) => (
                                        <TableRow
                                            hover
                                            style={{cursor: 'pointer'}}
                                            key={row.id}
                                            onClick={() => {
                                                dispatch(setSelectedCustomerCargo(row))
                                                history.push(`${window.location.pathname}/show`)
                                            }}
                                        >
                                            <TableCell>
                                                {row.productName}
                                            </TableCell>
                                            <TableCell>
                                                {row.cargoTypeName}
                                            </TableCell>
                                            <TableCell>
                                                -
                                            </TableCell>
                                            <TableCell>
                                                {row.lengthCargo}/{row.widthCargo}/{row.heightCargo}
                                            </TableCell>
                                            <TableCell>
                                                {row.totalVolume}
                                            </TableCell>
                                            <TableCell>
                                                {row.totalWeight}
                                            </TableCell>
                                            <TableCell>
                                                {row.amount}
                                            </TableCell>
                                            <TableCell>
                                                {row.status.toString()}
                                            </TableCell>
                                            <TableCell>
                                                -
                                            </TableCell>
                                            <TableCell>
                                                {row.barcode}
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

export default ActiveCargoListView
