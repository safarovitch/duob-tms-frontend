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
import {CargoProduct} from "../../../model/Cargo";
import {setSelectedProduct} from "../../../store/actions/cargoActions";
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

const ProductListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [products, setProducts] = useState<CargoProduct[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setOpen] = useState(false);
    const [selectedProduct, selectProduct] = useState<CargoProduct>();

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

    const handleSelectProduct = (product: CargoProduct, needDispatch: boolean) => {
        selectProduct(product);
        if (needDispatch) {
            dispatch(setSelectedProduct(product))
        } else {
            setOpen(true)
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        setOpen(false);
        setLoading(true)
        try {
            await cargoService.deleteProduct(productId);
            enqueueSnackbar(`Успешно удалено!`, {
                variant: 'success',
                action: <Button>ОК</Button>
            });
            setLoading(false)
            getProducts();
            setPage(1)
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getProducts()}>Рестарт</Button>
            });
        }
    };

    const getProducts = async () => {
        setLoading(true);
        try {
            const productObj: any = await cargoService.getFilteredProducts(page, size, query);
            setProducts(productObj.content)
            setTotal(productObj.totalElements)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getProducts()}>Рестарт</Button>
            });
        }
    };

    useEffect(() => {
        getProducts()
    }, [page, debouncedSearchTerm, size]);

    return (
        <>
            {products && (
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
                            placeholder="Поиск клиентов"
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
                                        <TableCell align="right" width="12%">
                                            Действия
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((product: CargoProduct) => {

                                        return (
                                            <TableRow
                                                hover
                                                key={product.id}
                                            >
                                                <TableCell>
                                                    {product.name}
                                                </TableCell>
                                                <TableCell align="right" width="12%">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/app/cargo/product/edit`}
                                                        onClick={() => handleSelectProduct(product, true)}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <EditIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleSelectProduct(product, false)}
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
                title={'Вы уверены, что хотите удалить наименование?'}
                description={'При удалении наименования, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно это наименование.'}
                onClose={() => setOpen(false)}
                onAccept={() => handleDeleteProduct(selectedProduct?.id!!)}/>
        </>
    );
}

export default ProductListView;
