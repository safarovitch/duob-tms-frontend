import React, {
    useState,
    useEffect,
} from 'react';
import {
    Avatar,
    Box, Card,
    Container, IconButton, InputAdornment, Link,
    makeStyles, SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography
} from '@material-ui/core';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    ArrowRight as ArrowRightIcon,

} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Page from '../../components/Page';
import Header from './Header';
import {Customer} from "../../model/Customer";
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
import errorMessageHandler from "../../utils/errorMessageHandler";
import NoFoundTableBody from "../../components/NoFoundTableBody";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 400
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

const CustomerListView: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [rows, setRows] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const canEdit = usePermission(PERMISSIONS.CUSTOMER.EDIT)
    const canDelete = usePermission(PERMISSIONS.CUSTOMER.DELETE)

    useEffect(() => {
        getRows().then(null)
    }, [page, debouncedSearchTerm, size]);

    const getRows = async () => {
        try {
            setLoading(true)
            setRows([])

            const data: any = await customerService.getFilteredCustomers(page, size, query);
            setRows(data.content)
            setTotal(data.totalElements)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    };

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setQuery(event.target.value);
        setPage(1);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    return (
        <Page className={classes.root} title="Клиенты">
            <Container maxWidth="lg">
                <Header/>
                <Box mt={3}>
                    <Card>
                        <Box py={3} pl={2}>
                            <TextField
                                className={classes.queryField}
                                size="small"
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
                            />
                        </Box>
                        <PerfectScrollbar>
                            <Box minWidth={700}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ФИО</TableCell>
                                            <TableCell>Код клиента</TableCell>
                                            <TableCell>Количество мест</TableCell>
                                            <TableCell>Сумма</TableCell>
                                            <TableCell>Баланс клиента</TableCell>
                                            {(canEdit || canDelete) && (
                                                <TableCell align="center" width="15%">Действия</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    {
                                        rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map((row: Customer) => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center">
                                                                <Avatar className={classes.avatar} src={row.avatar}>
                                                                    {getInitials(row.name)}
                                                                </Avatar>
                                                                <div>
                                                                    <Link
                                                                        color="inherit"
                                                                        onClick={() => dispatch(setSelectedCustomer(row))}
                                                                        component={RouterLink}
                                                                        to={`/app/customers/${row.id}`}
                                                                        variant="h6"
                                                                    >
                                                                        {row.name}
                                                                    </Link>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {row.phoneNumber}
                                                                    </Typography>
                                                                </div>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{row.code}</TableCell>
                                                        <TableCell>{row.placeNumber}</TableCell>
                                                        <TableCell>{row.amount}</TableCell>
                                                        <TableCell>{row.balance}</TableCell>
                                                        {(canEdit || canDelete) && (
                                                            <TableCell align="center" width="15%">
                                                                {canEdit && (
                                                                    <IconButton
                                                                        component={RouterLink}
                                                                        to={`/app/customers/${row.id}/edit`}
                                                                        onClick={() => dispatch(setSelectedCustomer(row))}
                                                                    >
                                                                        <SvgIcon fontSize="small">
                                                                            <EditIcon/>
                                                                        </SvgIcon>
                                                                    </IconButton>
                                                                )}
                                                                {canDelete && (
                                                                    <IconButton
                                                                        component={RouterLink}
                                                                        to={`/app/customers/${row.id}`}
                                                                        onClick={() => dispatch(setSelectedCustomer(row))}
                                                                    >
                                                                        <SvgIcon fontSize="small">
                                                                            <ArrowRightIcon/>
                                                                        </SvgIcon>
                                                                    </IconButton>
                                                                )}
                                                            </TableCell>
                                                        )}
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
                            labelRowsPerPage={'Количество клиентов:'}
                            rowsPerPage={size}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                        />
                    </Card>
                </Box>
            </Container>
        </Page>
    );
}

export default CustomerListView;
