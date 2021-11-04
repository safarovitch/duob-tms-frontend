import React, {useEffect, useReducer, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Avatar,
    Box,
    Card, Chip, Grid,
    IconButton,
    InputAdornment,
    Link,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import {Edit as EditIcon, Search as SearchIcon} from 'react-feather';
import getInitials from '../../../utils/getInitials';
import {Employee, Role} from "../../../model/Employee";
import {useDispatch} from "react-redux";
import {setSelectedEmployee} from "../../../store/actions/employeeActions";
import useDebounce from "../../../hooks/useDebounce";
import employeeService from "../../../services/EmployeeService";
import {useSnackbar} from "notistack";
import {EMPLOYEES_IMAGE_BASE_URL} from "../../../config";
import {mapOfRoles} from "../../../constants";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import DeleteButton from "../../../components/DeleteButton";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const useStyles = makeStyles((theme) => ({
    avatar: {
        height: 42,
        width: 42,
        marginRight: theme.spacing(1)
    },
}));

const Results: React.FC<{roles: Role[]}> = ({roles}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0);
    const [rows, setRows] = useState<Employee[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [query, setQuery] = useState('');
    const [rolesId, setRolesId] = useState<number[]>([]);
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await employeeService.getFilteredEmployees(page, size, debouncedSearchTerm, rolesId.join(','))

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
    }, [updateRows, enqueueSnackbar, page, size, debouncedSearchTerm, rolesId])

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

    const handleRolesIdChange = (id: number) => {
        const roles = [...rolesId];

        const index = rolesId.indexOf(id);
        if (index > - 1) {
            roles.splice(index, 1);
        } else roles.push(id);

        setRolesId(roles);
        setPage(1);
    };

    const hasRoleInRolesId = (id: number) => rolesId.indexOf(id) > - 1

    const handleDeleteRow = () => {
        setPage(1)
        setUpdateRows()
    };

    return (
        <Card>
            <Box py={3} pl={2} display="flex" alignItems="center">
                <Grid container spacing={2}>
                    <Grid item xs={10} sm={6} md={4}>
                        <TextField
                            size="small"
                            fullWidth
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
                    </Grid>
                    <Grid container item xs={12} sm={6} md={8} alignItems="center" justifyContent="flex-end" spacing={1}>
                        {roles.map(role => {
                            return (
                                <Grid item key={role.id}>
                                    {hasRoleInRolesId(role.id) ? (
                                        <Chip
                                            label={mapOfRoles.get(role.name)}
                                            clickable
                                            color="primary"
                                            onClick={() => handleRolesIdChange(role.id)}
                                            onDelete={() => handleRolesIdChange(role.id)}
                                            deleteIcon={<DoneIcon />}
                                        />
                                    ) : (
                                        <Chip
                                            label={mapOfRoles.get(role.name)}
                                            clickable
                                            onClick={() => handleRolesIdChange(role.id)}
                                        />
                                    )}
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            </Box>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ФИО</TableCell>
                                <TableCell>Должность</TableCell>
                                <TableCell>Склад</TableCell>
                                <TableCell>Код пользователя</TableCell>
                                <TableCell>Логин</TableCell>
                                <TableCell>Телефон</TableCell>
                                <TableCell align="center" width="15%">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: Employee, index) => {
                                        return (
                                            <TableRow hover key={row.id}>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar className={classes.avatar} src={EMPLOYEES_IMAGE_BASE_URL + row.avatar}>
                                                            {getInitials(row.name)}
                                                        </Avatar>
                                                        <Link color="inherit" component={RouterLink}
                                                              to={"/app/employees/" + row.id} variant="h6">
                                                            {row.name}
                                                        </Link>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{(row.roles!).map((role: Role)=>mapOfRoles.get(role.name)).join(', ')}</TableCell>
                                                <TableCell>{row.warehouseDto?.name}</TableCell>
                                                <TableCell>{row.code}</TableCell>
                                                <TableCell>{row.username}</TableCell>
                                                <TableCell>{row.phoneNumber}</TableCell>
                                                <TableCell align="center" width="15%">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={"/app/employees/" + row.id + "/edit"}
                                                        onClick={() => dispatch(setSelectedEmployee(row))}
                                                    >
                                                        <SvgIcon fontSize="small">
                                                            <EditIcon/>
                                                        </SvgIcon>
                                                    </IconButton>
                                                    <DeleteButton
                                                        index={index}
                                                        rowId={row.id!}
                                                        onDelete={employeeService.deleteEmployee}
                                                        handleDelete={handleDeleteRow}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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
                labelRowsPerPage={'Количество сотрудников:'}
                rowsPerPage={size}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
            />
        </Card>
    );
}

export default Results;
