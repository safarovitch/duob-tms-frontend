import React, {useEffect, useState} from "react";
import {Provider, ProviderListProps} from "../../model/Provider";
import {
    Box,
    Card,
    Container, IconButton,
    InputAdornment,
    makeStyles,
    SvgIcon,
    Table, TableBody, TableCell,
    TableHead, TablePagination, TableRow,
    TextField
} from "@material-ui/core";
import Page from "../../components/Page";
import Header from "./Header";
import providerService from "../../services/ProviderService";
import {Edit as EditIcon, Search as SearchIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import {NavLink as RouterLink} from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {setSelectedProvider} from "../../store/actions/providerActions";
import errorMessageHandler from "../../utils/errorMessageHandler";
import PERMISSIONS from "../../constants/permissions";
import usePermission from "../../hooks/usePermission";
import DeleteButton from "../../components/DeleteButton";
import NoFoundTableBody from "../../components/NoFoundTableBody";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 400
    }
}));

const ProviderListView: React.FC<ProviderListProps> = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [rows, setRows] = useState<Provider[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);
    const canEdit = usePermission(PERMISSIONS.PROVIDER.EDIT)
    const canDelete = usePermission(PERMISSIONS.PROVIDER.DELETE)

    useEffect(() => {
        getRows().then(null)
    }, [page, debouncedSearchTerm, size]);

    const getRows = async () => {
        try {
            setLoading(true)
            setRows([])

            const data: any = await providerService.getFilteredProvider(page, size, query);
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

    const handleDeleteRow = () => {
        setPage(1)
        getRows().then(null)
    };

    return (
        <Page className={classes.root} title="Поставщики">
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
                                            <TableCell>Торговая точка</TableCell>
                                            <TableCell>Контактное лицо</TableCell>
                                            <TableCell>Адрес</TableCell>
                                            <TableCell>Телефон</TableCell>
                                            {(canEdit || canDelete) && (
                                                <TableCell align="center" width="15%">Действия</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    {
                                        rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map((row: Provider, index) => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.code}</TableCell>
                                                        <TableCell>{row.address}</TableCell>
                                                        <TableCell>{row.phoneNumber}</TableCell>
                                                        {(canEdit || canDelete) && (
                                                            <TableCell align="center">
                                                                {canEdit && (
                                                                    <IconButton
                                                                        component={RouterLink}
                                                                        to={`/app/providers/${row.id}/edit`}
                                                                        onClick={() => dispatch(setSelectedProvider(row))}
                                                                    >
                                                                        <SvgIcon fontSize="small">
                                                                            <EditIcon/>
                                                                        </SvgIcon>
                                                                    </IconButton>
                                                                )}
                                                                {canDelete && (
                                                                    <DeleteButton
                                                                        index={index}
                                                                        rowId={row.id!}
                                                                        onDelete={providerService.deleteProvider}
                                                                        handleDelete={handleDeleteRow}
                                                                    />
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
                            labelRowsPerPage={'Количество поставщиков:'}
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

export default ProviderListView;
