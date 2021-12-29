import React, {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {StorageCost} from "../../model/StorageCost";
import errorMessageHandler from "../../utils/errorMessageHandler";
import storageCost from "../../services/StorageCostService";
import {
    Box,
    Card,
    Container, IconButton,
    makeStyles,
    Table, TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import Page from "../../components/Page";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import NoFoundTableBody from "../../components/NoFoundTableBody";
import {CheckCircle as CheckCircleIcon} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 400
    }
}));

const StorageCostListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<StorageCost[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])
                const data: any = await storageCost.getFilteredStorageCosts(page, size)
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
    }, [enqueueSnackbar, page, size])

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    return (
        <Page className={classes.root} title="Хранение">
            <Container maxWidth="md">
                <Header />
                <Box mt={3}>
                    <Card>
                        <PerfectScrollbar>
                            <Box minWidth={700}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Дата создания</TableCell>
                                            <TableCell>Бесплатный срок хранения (день)</TableCell>
                                            <TableCell>Стоимость хранения за сутки, м3 ($)</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    {
                                        rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map((row: StorageCost, index) => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell>{row.createdDate}</TableCell>
                                                        <TableCell>{row.freeTime}</TableCell>
                                                        <TableCell>{row.price}</TableCell>
                                                        <TableCell>
                                                            {index === 0 && page === 1 && (
                                                                <IconButton disabled size="small">
                                                                    <CheckCircleIcon style={{color: '1B9A4F'}} />
                                                                </IconButton>
                                                            )}
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
                </Box>
            </Container>
        </Page>
    )
}

export default StorageCostListView