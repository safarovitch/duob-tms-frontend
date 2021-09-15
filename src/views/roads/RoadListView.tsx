import React, {useEffect, useState} from "react";
import Header from "./Header";
import {
    Box,
    Card,
    Container,
    makeStyles,
    Table, TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import Page from "../../components/Page";
import {Road} from "../../model/Road";
import NoFoundTableBody from "../../components/NoFoundTableBody";
import PerfectScrollbar from "react-perfect-scrollbar";
import roadService from "../../services/RoadService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const RoadListView: React.FC = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [roads, setRoads] = useState<Road[]>([]);

    const getRoads = async () => {
        try {
            setLoading(true)
            setRoads([])

            const result: any = await roadService.getFilteredRoads(page, size)
            setRoads(result.content)
            setTotal(result.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getRoads().then(null)
    }, [page, size]);


    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    return (
        <Page
            className={classes.root}
            title={'Рейсы'}
        >
            <Container maxWidth="lg">
                <Header />
                <Box mt={3}>
                    <Card>
                        <PerfectScrollbar>
                            <Box minWidth={700}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Номер машины
                                            </TableCell>
                                            <TableCell>
                                                Прицеп
                                            </TableCell>
                                            <TableCell>
                                                Водитель
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        roads.length > 0
                                            ? roads.map((road: Road) => (
                                                <TableBody>
                                                    <TableRow
                                                        hover
                                                        key={road.id}
                                                    >
                                                        <TableCell>
                                                            {road.truckId}
                                                        </TableCell>
                                                        <TableCell>
                                                            {road.trailerId}
                                                        </TableCell>
                                                        <TableCell>
                                                            {road.driverId}
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
                    </Card>
                </Box>
            </Container>
        </Page>
    )
}

export default RoadListView
