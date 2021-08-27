import React, {useEffect, useState} from "react";
import {Provider, ProviderListProps} from "../../model/Provider";
import {
    Box, Button,
    Card, CircularProgress,
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
import clsx from "clsx";
import {Edit as EditIcon, Search as SearchIcon, Trash2 as DeleteIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import {NavLink as RouterLink} from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {setSelectedProvider} from "../../store/actions/providerActions";
import ConfirmModal from "../../components/ConfirmModal";
import errorMessageHandler from "../../utils/errorMessageHandler";

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

const ProviderListView: React.FC<ProviderListProps> = ({className}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [providers, setProviders] = useState<Provider[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [query, setQuery] = useState('');
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);
    const [providerId, setProviderId] = useState(0)
    const [isConfirmModalOpen, setOpen] = useState(false)

    useEffect(() => {
        getProviders().then(null)
    }, [page, debouncedSearchTerm, size])

    const getProviders = async () => {
        setLoading(true);
        try {
            const providersObj: any = await providerService.getFilteredProvider(page, size, query);
            setProviders(providersObj.content)
            setTotal(providersObj.totalElements)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getProviders()}>Рестарт</Button>
            });
        }
    };

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

    const handleProviderDelete = (id: number) => {
        setProviderId(id)
        setOpen(true)
    }

    const providerDelete = async (id: number) => {
        setOpen(false)
        setLoading(true)

        try {
            await providerService.deleteProvider(id);

            getProviders().then();

            enqueueSnackbar('Поставщик удален', {variant: 'success'})
        } catch (error) {
            setLoading(false)
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Page className={classes.root} title="Поставщики">
            <Container maxWidth={false}>
                <Header/>
                {providers && (
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
                                        placeholder="Поиск поставщиков"
                                        value={query}
                                        variant="outlined"
                                    /></Box>
                                <PerfectScrollbar>
                                    <Box minWidth={700} className={loading ? classes.tableProgressBoxStyle : ''}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Торговая точка
                                                    </TableCell>
                                                    <TableCell>
                                                        Контактное лицо
                                                    </TableCell>
                                                    <TableCell>
                                                        Адрес
                                                    </TableCell>
                                                    <TableCell>
                                                        Телефон
                                                    </TableCell>
                                                    <TableCell align="right" width="12%">
                                                        Действия
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {providers.map((provider: Provider) => {

                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={provider.id}
                                                        >
                                                            <TableCell>
                                                                {provider.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {provider.code}
                                                            </TableCell>
                                                            <TableCell>
                                                                {provider.address}
                                                            </TableCell>
                                                            <TableCell>
                                                                {provider.phoneNumber}
                                                            </TableCell>
                                                            <TableCell align="right" width="12%">
                                                                <IconButton
                                                                    component={RouterLink}
                                                                    to={`/app/providers/${provider.id}/edit`}
                                                                    onClick={() => dispatch(setSelectedProvider(provider))}
                                                                >
                                                                    <SvgIcon fontSize="small">
                                                                        <EditIcon/>
                                                                    </SvgIcon>
                                                                </IconButton>
                                                                <IconButton onClick={() => handleProviderDelete(provider.id!)}>
                                                                    <SvgIcon fontSize="small">
                                                                        <DeleteIcon/>
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
                                    labelRowsPerPage={'Количество поставщиков:'}
                                    rowsPerPage={size}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                    labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                                />
                            </Card>
                    </Box>
                )}
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    title={'Вы уверены, что хотите удалить поставщика?'}
                    description={'При удалении поставщика, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этот поставщик.'}
                    onClose={() => setOpen(false)}
                    onAccept={() => providerDelete(providerId)}/>
            </Container>
        </Page>
    )
}

export default ProviderListView;
