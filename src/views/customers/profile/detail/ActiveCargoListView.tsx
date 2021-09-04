import React, {useEffect, useState} from "react";
import {
    Box,
    Card, CircularProgress,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import {CustomerActiveCargo} from "../../../../model/Customer";
import customerService from "../../../../services/CustomerService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useParams} from "react-router";

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
    const [activeCargos, setActiveCargos] = useState<CustomerActiveCargo[]>([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(5)
    const [loading, setLoading] = useState(false)
    const {id} = useParams<{id: string}>()

    useEffect(() => {
        getActiveCargos().then(null)
    }, [page, size])

    const getActiveCargos = async () => {
        setLoading(true)

        try {
            const activeCargos: any = await customerService.getActiveCargos(id, page, size)
            setActiveCargos(activeCargos.content)
            setTotal(activeCargos.totalElements)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    return activeCargos && (
        <Card className={classes.root}>
            <PerfectScrollbar>
                <Box minWidth={700} className={loading ? classes.tableProgressBoxStyle : ''}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Груз
                                </TableCell>
                                <TableCell>
                                    Вид груза
                                </TableCell>
                                <TableCell>
                                    Номер рейса
                                </TableCell>
                                <TableCell>
                                    Д/Ш/В
                                </TableCell>
                                <TableCell>
                                    Обьем(м3)
                                </TableCell>
                                <TableCell>
                                    Вес(кг)
                                </TableCell>
                                <TableCell>
                                    Стоимост $
                                </TableCell>
                                <TableCell>
                                    Статус
                                </TableCell>
                                <TableCell>
                                    Просроченно дней
                                </TableCell>
                                <TableCell>
                                    Штрих-код
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeCargos.map((activeCargo: CustomerActiveCargo) => {
                                return (
                                    <TableRow
                                        hover
                                        key={activeCargo.id}
                                    >
                                        {/*<TableCell>*/}
                                        {/*    {activeCargo.name}*/}
                                        {/*</TableCell>*/}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {loading && (<CircularProgress size={48} className={classes.tableProgress}/>)}
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
