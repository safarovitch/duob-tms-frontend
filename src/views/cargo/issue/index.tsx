import React, {useEffect, useReducer, useState} from "react";
import {CargoIssueResponse} from "../../../model/Cargo";
import {
    Badge,
    Box,
    Breadcrumbs, Card,
    Container, IconButton,
    InputAdornment,
    Link,
    makeStyles,
    SvgIcon, Table, TableBody, TableCell, TableHead, TablePagination, TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import cargoService from "../../../services/CargoService";
import Page from "../../../components/Page";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link as RouterLink} from "react-router-dom";
import {ArrowRight as ArrowRightIcon, Search as SearchIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {mapOfStatusCargoIssue, mapOfStatusColorCargoIssue} from "../../../constants";
import hasPermission from "../../../hooks/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import DeleteButton from "../../../components/DeleteButton";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 400
    },
}));

const CargoIssueList: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0);
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500);
    const [rows, setRows] = useState<CargoIssueResponse[]>([])
    const [loading, setLoading] = useState(false)
    const canDelete = hasPermission(PERMISSIONS.CARGO.ISSUES.DELETE)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await cargoService.getFilteredCargoIssues(page, size, debouncedSearchTerm);

                if (!cancel) {
                    setRows(data.content)
                    setTotal(data.totalElements)
                }
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [updateRows, enqueueSnackbar, page, debouncedSearchTerm, size]);

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
        setUpdateRows()
    };

    return (
        <Page className={classes.root} title="Выдача груза">
            <Container maxWidth="lg">
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Link color="inherit" to="/app" component={RouterLink}>
                        Главная
                    </Link>
                    <Typography color="textPrimary">
                        Выдача груза
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    Выдача груза
                </Typography>
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
                                            <TableCell>Дата</TableCell>
                                            <TableCell>Клиент</TableCell>
                                            <TableCell>Баланс</TableCell>
                                            <TableCell>Грузы на сумму</TableCell>
                                            <TableCell>Статус</TableCell>
                                            <TableCell>Завсклад</TableCell>
                                            <TableCell>Менеджер</TableCell>
                                            <TableCell align="center" width="15%">Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map((row: CargoIssueResponse, index: number) => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell>
                                                            {
                                                                row.credit ? (<Badge color="error" variant="dot" badgeContent=" ">{row.createdDate}</Badge>) : row.createdDate
                                                            }
                                                        </TableCell>
                                                        <TableCell>{row.client.code}</TableCell>
                                                        <TableCell>{row.client.balance} $</TableCell>
                                                        <TableCell>{row.actualAmount} $</TableCell>
                                                        <TableCell style={{color: mapOfStatusColorCargoIssue.get(row.status)}}>{mapOfStatusCargoIssue.get(row.status)}</TableCell>
                                                        <TableCell>{row.createdBy.name}</TableCell>
                                                        <TableCell>{row.approvalBy?.name || '-'}</TableCell>
                                                        <TableCell align="center" width="15%">
                                                            {
                                                                row.status === 'WAITING' && canDelete && (
                                                                    <DeleteButton
                                                                        index={index}
                                                                        rowId={row.id!}
                                                                        onDelete={cargoService.deleteCargoIssue}
                                                                        handleDelete={handleDeleteRow}
                                                                    />
                                                                )
                                                            }
                                                            <IconButton
                                                                component={RouterLink}
                                                                to={`/app/cargo-issues/${row.id}/show`}
                                                            >
                                                                <SvgIcon fontSize="small">
                                                                    <ArrowRightIcon/>
                                                                </SvgIcon>
                                                            </IconButton>
                                                        </TableCell>
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
    )
}

export default CargoIssueList
