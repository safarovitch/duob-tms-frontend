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
import {CustomerReconciliationAct} from "../../../../model/Customer";
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

const ReconciliationActListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [reconciliationActs, setReconciliationActs] = useState<CustomerReconciliationAct[]>([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(5)
    const [loading, setLoading] = useState(false)
    const {id} = useParams<{id: string}>()

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)

                const data: any = await customerService.getReconciliationActs(id, page, size)

                setReconciliationActs(data.content)
                setTotal(data.totalElements)
                setLoading(false)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [id, page, size, enqueueSnackbar])

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    return reconciliationActs && (
        <Card className={classes.root}>
            <PerfectScrollbar>
                <Box minWidth={700} className={loading ? classes.tableProgressBoxStyle : ''}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Дата
                                </TableCell>
                                <TableCell>
                                    Поступление ($)
                                </TableCell>
                                <TableCell>
                                    Поступление(м)
                                </TableCell>
                                <TableCell>
                                    Скидка ($)
                                </TableCell>
                                <TableCell>
                                    Скидка (м)
                                </TableCell>
                                <TableCell>
                                    Оплата ($)
                                </TableCell>
                                <TableCell>
                                    Оплата(м)
                                </TableCell>
                                <TableCell>
                                    Остаток ($)
                                </TableCell>
                                <TableCell>
                                    Остаток (м)
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reconciliationActs.map((reconciliationAct: CustomerReconciliationAct) => {
                                return (
                                    <TableRow
                                        hover
                                        key={reconciliationAct.id}
                                    >
                                        {/*<TableCell>*/}
                                        {/*    {reconciliationAct.name}*/}
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

export default ReconciliationActListView

