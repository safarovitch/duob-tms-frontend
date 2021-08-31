import React, {
    useState,
    useEffect,
} from 'react';
import {
    Box, Button, Card, CircularProgress, IconButton, InputAdornment,
    makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField
} from '@material-ui/core';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Trash as TrashIcon,

} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {NavLink as RouterLink} from "react-router-dom";
import 'moment/locale/ru';
import {useDispatch} from "react-redux";
import useDebounce from "../../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {CargoCustomCode} from "../../../model/Cargo";
import {setSelectedCustomCode} from "../../../store/actions/cargoActions";
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

const CustomCodeListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [customCodes, setCustomCodes] = useState<CargoCustomCode[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [selectedCustomCode, selectCustomCode] = useState<CargoCustomCode>();

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

    const handleSelectCustomCode = (customCode: CargoCustomCode, needDispatch: boolean) => {
        selectCustomCode(customCode);
        if (needDispatch) {
            dispatch(setSelectedCustomCode(customCode))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteCustomCode = async (customCodeId: number) => {
        setOpen(false);
        setLoading(true)
        try {
            await cargoService.deleteCustomCode(customCodeId);
            enqueueSnackbar(`Успешно удалено!`, {variant: 'success'});
            setLoading(false)
            getCustomCodes();
            setPage(1)
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getCustomCodes()}>Рестарт</Button>
            });
        }
    };

    const getCustomCodes = async () => {
        setLoading(true);
        try {
            const productObj: any = await cargoService.getFilteredCustomCodes(page, size, query);
            setCustomCodes(productObj.content)
            setTotal(productObj.totalElements)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getCustomCodes()}>Рестарт</Button>
            });
        }
    };

    useEffect(() => {
        getCustomCodes()
    }, [page, debouncedSearchTerm, size]);

    return (
        <>
            {customCodes && (
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
                                            Наименование
                                        </TableCell>
                                        <TableCell>
                                            Код
                                        </TableCell>
                                        <TableCell>
                                            Стоимость
                                        </TableCell>
                                        <TableCell>
                                            Базовая ставка %
                                        </TableCell>
                                        <TableCell>
                                            НДС %
                                        </TableCell>
                                        <TableCell>
                                            Итоговая стоимость
                                        </TableCell>
                                        <TableCell>
                                            Единица расчета
                                        </TableCell>
                                        <TableCell align="right" width="12%">
                                            Действия
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customCodes.map((customCode: CargoCustomCode) => {

                                        return (
                                            <TableRow
                                                hover
                                                key={customCode.id}
                                            >
                                                <TableCell>
                                                    {customCode.productDto?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {customCode.code}
                                                </TableCell>
                                                <TableCell>
                                                    {customCode.price}
                                                </TableCell>
                                                <TableCell>
                                                    {customCode.baseRate}
                                                </TableCell>
                                                <TableCell>
                                                    {customCode.vat}
                                                </TableCell>
                                                <TableCell>
                                                    {customCode.totalRate}
                                                </TableCell>
                                                <TableCell>
                                                    {customCode.unit}
                                                </TableCell>
                                                <TableCell align="right" width="12%">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/app/cargo/customs/edit`}
                                                        onClick={() => handleSelectCustomCode(customCode, true)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <EditIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleSelectCustomCode(customCode, false)}
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
                title={'Вы уверены, что хотите удалить томоженный код?'}
                description={'При удалении таможенного кода, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этот томоженный код.'}
                onClose={() => setOpen(false)}
                onAccept={() => handleDeleteCustomCode(selectedCustomCode?.id!!)}/>
        </>
    );
}

export default CustomCodeListView;
