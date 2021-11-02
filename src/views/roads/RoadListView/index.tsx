import React, {useEffect, useReducer, useState} from "react";
import Header from "./Header";
import {
    Box,
    Card,
    Container,
    IconButton,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import Page from "../../../components/Page";
import {RoadList} from "../../../model/Road";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import PerfectScrollbar from "react-perfect-scrollbar";
import roadService from "../../../services/RoadService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {NavLink as RouterLink} from "react-router-dom";
import {ArrowRight as ArrowRightIcon} from "react-feather";
import DeleteButton from "../../../components/DeleteButton";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const RoadListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<RoadList[]>([])

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                setRows([])

                const result: any = await roadService.getFilteredRoads(page, size)
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
        <Page
            className={classes.root}
            title={'Рейсы'}
        >
            <Container maxWidth="lg">
                <Header/>
                <Box mt={3}>
                    <Card>
                        <PerfectScrollbar>
                            <Box minWidth={700}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Номер
                                            </TableCell>
                                            <TableCell>
                                                Путь рейса
                                            </TableCell>
                                            <TableCell>
                                                Номер машин
                                            </TableCell>
                                            <TableCell>
                                                Кол-во грузов
                                            </TableCell>
                                            <TableCell>
                                                Недостающий груз
                                            </TableCell>
                                            <TableCell>
                                                Статус
                                            </TableCell>
                                            <TableCell align="center" width="15%">
                                                Действия
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        rows.length > 0
                                            ? <TableBody>
                                                {rows.map((row: RoadList, index) => (
                                                    <TableRow
                                                        hover
                                                        key={row.id}
                                                    >
                                                        <TableCell>
                                                            №{row.id}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.road}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.truck?.number || '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.status ? 'Завершенный' : 'Активный'}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <DeleteButton
                                                                index={index}
                                                                rowId={row.id!}
                                                                onDelete={roadService.deleteRoad}
                                                                handleDelete={handleDeleteRow}
                                                            />
                                                            <IconButton
                                                                component={RouterLink}
                                                                to={`/app/roads/${row.id}/main`}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <ArrowRightIcon />
                                                                </SvgIcon>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
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
