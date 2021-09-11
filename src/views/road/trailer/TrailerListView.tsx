import React, {
    useState,
    useEffect,
} from 'react';
import {
    Box, Card, CircularProgress, IconButton,
    makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow,
} from '@material-ui/core';
import {Edit as EditIcon, Trash as TrashIcon} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {Trailer} from "../../../model/Road";
import {setSelectedTrailer} from "../../../store/actions/roadActions";
import roadService from "../../../services/RoadService";
import ConfirmModal from "../../../components/ConfirmModal";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    tableProgressBoxStyle: {position: 'relative', pointerEvents: 'none', backgroundColor: '#00000005'},
    tableProgress: {
        color: "secondary",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
    }
}));

const TrailerListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [trailers, setTrailers] = useState<Trailer[]>([]);
    const [selectedTrailer, selectTrailer] = useState<Trailer>();

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectTrailer = (trailer: Trailer, needDispatch: boolean) => {
        selectTrailer(trailer);

        if (needDispatch) {
            dispatch(setSelectedTrailer(trailer))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteTrailer = async (trailerId: number) => {
        setOpen(false)
        setLoading(true)

        try {
            await roadService.deleteTrailer(trailerId);
            enqueueSnackbar(`Успешно удалено!`, {variant: 'success'})
            getTrailers().then(null)
            setPage(1)
        } catch (error) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    const getTrailers = async () => {
        setLoading(true)

        try {
            const result: any = await roadService.getFilteredTrailers(page, size)
            setTrailers(result.content)
            setTotal(result.totalElements)
        } catch (error) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getTrailers().then(null)
    }, [page, size]);

    return (
        <>
            {loading && (<CircularProgress size={48} className={classes.tableProgress}/>)}
            {trailers?.length > 0 && (
                <>
                    <Card
                        className={classes.root}
                    >
                        <PerfectScrollbar>
                            <Box minWidth={700} className={loading ? classes.tableProgressBoxStyle : ''}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Номер прицепа
                                            </TableCell>
                                            <TableCell>
                                                Грузо подъёмность (кг)
                                            </TableCell>
                                            <TableCell>
                                                Общий объём кузова (м3)
                                            </TableCell>
                                            <TableCell align="center" width="12%">
                                                Действия
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {trailers.map((trailer: Trailer) => {

                                            return (
                                                <TableRow
                                                    hover
                                                    key={trailer.id}
                                                >
                                                    <TableCell>
                                                        {trailer.trailerNumber}
                                                    </TableCell>
                                                    <TableCell>
                                                        {trailer.liftingCapacity}
                                                    </TableCell>
                                                    <TableCell>
                                                        {trailer.totalBodyCapacity}
                                                    </TableCell>
                                                    <TableCell align="center" width="12%">
                                                        <IconButton
                                                            component={RouterLink}
                                                            to={`/app/road/trailer/edit`}
                                                            onClick={() => handleSelectTrailer(trailer, true)}
                                                        >
                                                            <SvgIcon fontSize="small">
                                                                <EditIcon/>
                                                            </SvgIcon>
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleSelectTrailer(trailer, false)}
                                                        >
                                                            <SvgIcon fontSize="small">
                                                                <TrashIcon/>
                                                            </SvgIcon>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
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
                    <ConfirmModal
                        isOpen={isConfirmModalOpen}
                        title={'Вы уверены, что хотите удалить прицеп?'}
                        description={'При удалении прицепа, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этого прицепа.'}
                        onClose={() => setOpen(false)}
                        onAccept={() => handleDeleteTrailer(selectedTrailer?.id!!)} />
                </>
            )}
        </>
    );
}

export default TrailerListView;
