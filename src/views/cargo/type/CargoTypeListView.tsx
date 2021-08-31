import React, {
    useState,
    useEffect,
} from 'react';
import {
    Box, Button, Card, CircularProgress,
    IconButton, InputAdornment,
    makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField
} from '@material-ui/core';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Trash as TrashIcon,
    Check as CheckIcon,
    X as XIcon,

} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import 'moment/locale/ru';
import {useDispatch} from "react-redux";
import useDebounce from "../../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {CargoType} from "../../../model/Cargo";
import {setSelectedType} from "../../../store/actions/cargoActions";
import cargoService from "../../../services/CargoService";
import ConfirmModal from "../../../components/ConfirmModal";

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

const CargoTypeListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [cargoTypes, setCargoTypes] = useState<CargoType[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [selectedCargoType, selectCargoType] = useState<CargoType>();

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setQuery(event.target.value);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectCargoType = (cargoType: CargoType, needDispatch: boolean) => {
        selectCargoType(cargoType);
        if (needDispatch) {
            dispatch(setSelectedType(cargoType))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteCargoType = async (cargoTypeId: number) => {
        setOpen(false);
        setLoading(true)
        try {
            await cargoService.deleteCargoType(cargoTypeId);
            enqueueSnackbar(`Успешно удалено!`, {
                variant: 'success',
                action: <Button>ОК</Button>
            });
            getCargoTypes();
            setLoading(false);
            setPage(1);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getCargoTypes()}>Рестарт</Button>
            });
        }
    };

    const getCargoTypes = async () => {
        setLoading(true);
        try {
            const cargoTypeObj: any = await cargoService.getFilteredCargoTypes(page, size, query);
            setCargoTypes(cargoTypeObj.content)
            setTotal(cargoTypeObj.totalElements)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getCargoTypes()}>Рестарт</Button>
            });
        }
    };

    useEffect(() => {
        getCargoTypes()
    }, [page, debouncedSearchTerm, size]);

    return (
        <>
            {cargoTypes && (
                <Card
                    className={classes.root}
                >
                    <Box
                        p={2}
                        minHeight={56}
                        display="flex"
                        alignItems="center"
                    >
                        <TextField
                            className={classes.queryField}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            fontSize="small"
                                            color="action"
                                        >
                                            <SearchIcon/>
                                        </SvgIcon>
                                    </InputAdornment>
                                )
                            }}
                            onChange={handleQueryChange}
                            placeholder="Поиск"
                            value={query}
                            variant="outlined"
                        /></Box>
                    <PerfectScrollbar>
                        <Box minWidth={700} className={loading ? classes.tableProgressBoxStyle : ''}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Название
                                        </TableCell>
                                        <TableCell align="center">
                                            Ручная цена
                                        </TableCell>
                                        <TableCell align="center">
                                            Договорная цена
                                        </TableCell>
                                        <TableCell align="center">
                                            Расчет по норме и весу
                                        </TableCell>
                                        <TableCell align="center">
                                            Учитывать скидку
                                        </TableCell>
                                        <TableCell align="right" width="12%">
                                            Действия
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cargoTypes.map((cargoType: CargoType) => {

                                        return (
                                            <TableRow
                                                hover
                                                key={cargoType.id}
                                            >
                                                <TableCell>
                                                    {cargoType.name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {cargoType.manualPrice ? (<CheckIcon style={{color: 'green'}}/>) : (<XIcon style={{color: 'red'}}/>)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {cargoType.negotiatedPrice ? (<CheckIcon style={{color: 'green'}}/>) : (<XIcon style={{color: 'red'}}/>)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {cargoType.calculationRateWeight ? (<CheckIcon style={{color: 'green'}}/>) : (<XIcon style={{color: 'red'}}/>)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {cargoType.discount ? (<CheckIcon style={{color: 'green'}}/>) : (<XIcon style={{color: 'red'}}/>)}
                                                </TableCell>
                                                <TableCell align="right" width="12%">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/app/cargo/type/edit`}
                                                        onClick={() => handleSelectCargoType(cargoType, true)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <EditIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleSelectCargoType(cargoType, false)}
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
                            {loading && (<CircularProgress size={48} className={classes.tableProgress}/>)}
                        </Box>
                    </PerfectScrollbar>
                    <TablePagination
                        component="div"
                        count={total}
                        onPageChange={handlePageChange}
                        page={page - 1}
                        labelRowsPerPage={'Количество наименований:'}
                        rowsPerPage={size}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                    />
                </Card>
            )}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={'Вы уверены, что хотите удалить вид груза?'}
                description={'При удалении вида груза, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этот вид груза.'}
                onClose={() => setOpen(false)}
                onAccept={() => handleDeleteCargoType(selectedCargoType?.id!!)}/>
        </>
    );
}

export default CargoTypeListView;
