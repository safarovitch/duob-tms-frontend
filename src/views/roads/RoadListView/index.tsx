import React, {useEffect, useState} from "react";
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
import {Edit as EditIcon, Trash as TrashIcon} from "react-feather";
import ConfirmModal from "../../../components/ConfirmModal";

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
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [loading, setLoading] = useState(false)
    const [roads, setRoads] = useState<RoadList[]>([])
    const [selectedRoadId, selectRoadId] = useState<number>()
    const [isConfirmModalOpen, setOpen] = useState(false);


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

    const handleSelectDriver = (id: number) => {
        selectRoadId(id)
        setOpen(true)
    }

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
    }

    const handleDeleteRoad = async () => {
        try {
            setPage(1)
            setOpen(false)

            await roadService.deleteRoad(selectedRoadId!!);

            enqueueSnackbar(`Успешно удалено!`, {variant: 'success'})
            getRoads().then(null)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

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
                                            <TableCell align="center" width="12%">
                                                Действия
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        roads.length > 0
                                            ? <TableBody>
                                                {roads.map((road: RoadList) => (
                                                    <TableRow
                                                        hover
                                                        key={road.id}
                                                    >
                                                        <TableCell>
                                                            {road.id}
                                                        </TableCell>
                                                        <TableCell>
                                                            {road.road}
                                                        </TableCell>
                                                        <TableCell>
                                                            {road.truck?.number || '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            0
                                                        </TableCell>
                                                        <TableCell>
                                                            {road.status ? 'Активный' : 'Завершенный'}
                                                        </TableCell>
                                                        <TableCell align="center" width="12%">
                                                            <IconButton
                                                                component={RouterLink}
                                                                to={`/app/roads/${road.id}/main`}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <EditIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleSelectDriver(road.id)}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <TrashIcon/>
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
                        <ConfirmModal
                            isOpen={isConfirmModalOpen}
                            title={'Вы уверены, что хотите удалить рейс?'}
                            description={'При удалении рейса, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этот рейс.'}
                            onClose={() => setOpen(false)}
                            onAccept={() => handleDeleteRoad()}/>
                    </Card>
                </Box>
            </Container>
        </Page>
    )
}

export default RoadListView
