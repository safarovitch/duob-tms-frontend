import React, {
    useState,
    useEffect,
} from 'react';
import {
    Avatar,
    Box, Button, Card, CircularProgress,
    Container, IconButton, InputAdornment, Link,
    makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography
} from '@material-ui/core';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    ArrowRight as ArrowRightIcon,

} from 'react-feather';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Page from '../../components/Page';
import Header from './Header';
import {Customer, CustomerListProps} from "../../model/Customer";
import {NavLink as RouterLink} from "react-router-dom";
import getInitials from "../../utils/getInitials";
import customerService from "../../services/CustomerService";
import 'moment/locale/ru';
import {useDispatch} from "react-redux";
import {setSelectedCustomer} from "../../store/actions/customerActions";
import useDebounce from "../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import usePermission from "../../hooks/usePermission";
import PERMISSIONS from "../../constants/permissions";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 500
    },
    bulkOperations: {
        position: 'relative'
    },
    bulkActions: {
        paddingLeft: 4,
        paddingRight: 4,
        marginTop: 6,
        position: 'absolute',
        width: '100%',
        zIndex: 2,
        backgroundColor: theme.palette.background.default
    },
    bulkAction: {
        marginLeft: theme.spacing(2)
    },
    avatar: {
        height: 42,
        width: 42,
        marginRight: theme.spacing(1)
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

const CustomerListView: React.FC<CustomerListProps> = ({className}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);
    const canEdit = usePermission(PERMISSIONS.CUSTOMER.EDIT)
    const canDelete = usePermission(PERMISSIONS.CUSTOMER.DELETE)

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

    const getCustomers = async () => {
        setLoading(true);
        try {
            const customerObj: any = await customerService.getFilteredCustomers(page, size, query);
            setCustomers(customerObj.content)
            setTotal(customerObj.totalElements)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getCustomers()}>Рестарт</Button>
            });
        }
    };

    useEffect(() => {
        getCustomers()
    }, [page, debouncedSearchTerm, size]);

    return (
        <Page
            className={classes.root}
            title="Клиенты"
        >
            <Container maxWidth={false}>
                <Header/>
                {customers && (
                    <Box mt={3} >
                        <Card
                            className={clsx(classes.root, className)}
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
                                                    ФИО
                                                </TableCell>
                                                <TableCell>
                                                    Код клиента
                                                </TableCell>
                                                <TableCell>
                                                    Количество мест
                                                </TableCell>
                                                <TableCell>
                                                    Сумма
                                                </TableCell>
                                                <TableCell>
                                                    Баланс клиента
                                                </TableCell>
                                                {(canEdit || canDelete) && (
                                                    <TableCell align="right" width="12%">
                                                        Действия
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {customers.map((customer: Customer) => {

                                                return (
                                                    <TableRow
                                                        hover
                                                        key={customer.id}
                                                    >
                                                        <TableCell>
                                                            <Box
                                                                display="flex"
                                                                alignItems="center"
                                                            >
                                                                <Avatar
                                                                    className={classes.avatar}
                                                                    src={customer.avatar}
                                                                >
                                                                    {getInitials(customer.name)}
                                                                </Avatar>
                                                                <div>
                                                                    <Link
                                                                        color="inherit"
                                                                        onClick={() => dispatch(setSelectedCustomer(customer))}
                                                                        component={RouterLink}
                                                                        to={`/app/customers/${customer.id}`}
                                                                        variant="h6"
                                                                    >
                                                                        {customer.name}
                                                                    </Link>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="textSecondary"
                                                                    >
                                                                        {customer.phoneNumber}
                                                                    </Typography>
                                                                </div>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            {customer.code}
                                                        </TableCell>
                                                        <TableCell>
                                                            {customer.placeNumber}
                                                        </TableCell>
                                                        <TableCell>
                                                            {customer.amount}
                                                        </TableCell>
                                                        <TableCell>
                                                            {customer.balance}
                                                        </TableCell>
                                                        {(canEdit || canDelete) && (
                                                            <TableCell align="right" width="12%">
                                                                {canEdit && (
                                                                    <IconButton
                                                                        component={RouterLink}
                                                                        to={`/app/customers/${customer.id}/edit`}
                                                                        onClick={() => dispatch(setSelectedCustomer(customer))}
                                                                    >
                                                                        <SvgIcon fontSize="small">
                                                                            <EditIcon/>
                                                                        </SvgIcon>
                                                                    </IconButton>
                                                                )}
                                                                {canDelete && (
                                                                    <IconButton
                                                                        component={RouterLink}
                                                                        to={`/app/customers/${customer.id}`}
                                                                        onClick={() => dispatch(setSelectedCustomer(customer))}
                                                                    >
                                                                        <SvgIcon fontSize="small">
                                                                        <ArrowRightIcon/>
                                                                        </SvgIcon>
                                                                    </IconButton>
                                                                )}
                                                            </TableCell>
                                                        )}
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
                                labelRowsPerPage={'Количество клиентов:'}
                                rowsPerPage={size}
                                rowsPerPageOptions={[5, 10, 25]}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                            />
                        </Card>
                    </Box>
                )}
            </Container>
        </Page>
    );
}

export default CustomerListView;
