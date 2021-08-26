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

} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import useDebounce from "../../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {CargoTariff} from "../../../model/Cargo";
import {setSelectedCargoTariff} from "../../../store/actions/cargoActions";
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

const CargoTariffListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [cargoTariffs, setCargoTariffs] = useState<CargoTariff[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [selectedCargoTariff, selectCargoTariff] = useState<CargoTariff>();

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setQuery(event.target.value);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSelectCargoTariff = (cargoTariff: CargoTariff, needDispatch: boolean) => {
        selectCargoTariff(cargoTariff);
        if (needDispatch) {
            dispatch(setSelectedCargoTariff(cargoTariff))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteCargoTariff = async (cargoTariffId: number) => {
        setOpen(false);
        setLoading(true)
        try {
            await cargoService.deleteCargoTariff(cargoTariffId);
            enqueueSnackbar(`Успешно удалено!`, {
                variant: 'success',
                action: <Button>ОК</Button>
            });
            getCargoTariffs();
            setLoading(false);
            setPage(1);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getCargoTariffs()}>Рестарт</Button>
            });
        }
    };

    const getCargoTariffs = async () => {
        setLoading(true);
        try {
            const cargoTariffObj: any = await cargoService.getFilteredCargoTariffs(page, size, query);
            setCargoTariffs(cargoTariffObj.content)
            setTotal(cargoTariffObj.totalElements)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getCargoTariffs()}>Рестарт</Button>
            });
        }
    };

    useEffect(() => {
        getCargoTariffs()
    }, [page, debouncedSearchTerm, size]);

    return (
        <>
            {cargoTariffs && (
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
                                        <TableCell>
                                            Филиал
                                        </TableCell>
                                        <TableCell>
                                            Описание
                                        </TableCell>
                                        <TableCell align="right" width="12%">
                                            Действия
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cargoTariffs.map((cargoTariff: CargoTariff) => {

                                        return (
                                            <TableRow
                                                hover
                                                key={cargoTariff.id}
                                            >
                                                <TableCell>
                                                    {cargoTariff.name}
                                                </TableCell>
                                                <TableCell>
                                                    {cargoTariff.warehouseDto?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {cargoTariff.description}
                                                </TableCell>
                                                <TableCell align="right" width="12%">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/app/cargo/tariff/edit`}
                                                        onClick={() => handleSelectCargoTariff(cargoTariff, true)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <EditIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleSelectCargoTariff(cargoTariff, false)}
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
                        labelRowsPerPage={'Количество тарифов:'}
                        rowsPerPage={size}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                    />
                </Card>
            )}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title={'Вы уверены, что хотите удалить тариф?'}
                description={'При удалении тарифа, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этот тариф.'}
                onClose={() => setOpen(false)}
                onAccept={() => handleDeleteCargoTariff(selectedCargoTariff?.id!!)}/>
        </>
    );
}

export default CargoTariffListView;
