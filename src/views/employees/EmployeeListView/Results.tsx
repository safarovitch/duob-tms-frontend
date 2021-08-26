import React, {useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Avatar,
    Box, Button,
    Card, Chip, CircularProgress, Dialog, DialogActions, DialogTitle, Grid,
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
import {Edit as EditIcon, Search as SearchIcon, Trash2 as DeleteIcon} from 'react-feather';
import getInitials from '../../../utils/getInitials';
import {Employee, Role} from "../../../model/Employee";
import {useDispatch} from "react-redux";
import {setSelectedEmployee} from "../../../store/actions/employeeActions";
import useDebounce from "../../../hooks/useDebounce";
import employeeService from "../../../services/EmployeeService";
import {useSnackbar} from "notistack";
import {EMPLOYEES_IMAGE_BASE_URL} from "../../../config";
import {mapOfRoles} from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {},
    tableProgressBoxStyle: {position: 'relative', pointerEvents: 'none', backgroundColor: '#00000005'},
    tableProgress: {
        color: "secondary",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const Results: React.FC<{className?: string, roles: Role[]}> = ({className, roles, ...rest}) => {
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false)
    const [idEmployee, setIdEmployee] = useState(0)
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [query, setQuery] = useState('');
    const [rolesId, setRolesId] = useState<number[]>([]);
    const debouncedSearchTerm = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getEmployee().then(null)
    }, [page, size, debouncedSearchTerm, rolesId])

    const getEmployee = async () => {
        setLoading(true);
        try {
            const data: any = await employeeService.getEmployees(page, size, query, rolesId.join(','))
            setEmployees(data.content)
            setTotal(data.totalElements)
            setLoading(false);
        } catch (error) {
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: <Button onClick={() => getEmployee()}>Рестарт</Button>
            });
            setLoading(false);
        }
    }

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setQuery(event.target.value);
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handleEmployeeEdit = (employee: Employee) => {
        dispatch(setSelectedEmployee(employee))
    }

    const handleEmployeeDelete = (id: number) => {
        setOpenDialog(true)
        setIdEmployee(id)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const handleAgree = () => {
        setOpenDialog(false)
        employeeDelete(idEmployee).then()
    }

    const employeeDelete = async (id: number) => {
        try {
            await employeeService.deleteEmployee(id);

            getEmployee().then();

            enqueueSnackbar('Сотрудник удален', {
                variant: 'success',
                action: key => (<Button onClick={() => { closeSnackbar(key) }}>OK</Button>)
            })
        } catch (error) {
            enqueueSnackbar(`Произошла ошибка. ${error.message}`, {
                variant: 'error',
                action: key => (<Button onClick={() => { closeSnackbar(key) }}>OK</Button>)
            })
        }
    }

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

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <Box p={2} minHeight={56} display="flex" alignItems="center">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
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
                <Box minWidth={700} className={loading ? classes.tableProgressBoxStyle : ''}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    ФИО
                                </TableCell>
                                <TableCell>
                                    Должность
                                </TableCell>
                                <TableCell>
                                    Склад
                                </TableCell>
                                <TableCell>
                                    Код пользователя
                                </TableCell>
                                <TableCell>
                                    Логин
                                </TableCell>
                                <TableCell>
                                    Телефон
                                </TableCell>
                                <TableCell align="right" width="12%"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee) => {
                                return (
                                    <TableRow hover key={employee.id}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Avatar className={classes.avatar} src={EMPLOYEES_IMAGE_BASE_URL + employee.avatar}>
                                                    {getInitials(employee.name)}
                                                </Avatar>
                                                <Link color="inherit" component={RouterLink}
                                                      to={"/app/employees/" + employee.id} variant="h6">
                                                    {employee.name}
                                                </Link>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {(employee.roles!).map((role: Role)=>mapOfRoles.get(role.name)).join(', ')}
                                        </TableCell>
                                        <TableCell>
                                            {employee.warehouseDto?.name}
                                        </TableCell>
                                        <TableCell>
                                            {employee.code}
                                        </TableCell>
                                        <TableCell>
                                            {employee.username}
                                        </TableCell>
                                        <TableCell>
                                            {employee.phoneNumber}
                                        </TableCell>
                                        <TableCell align="right" width="12%">
                                            <IconButton
                                                onClick={() => handleEmployeeEdit(employee)}
                                                component={RouterLink}
                                                to={"/app/employees/" + employee.id + "/edit"}
                                            >
                                                <SvgIcon fontSize="small">
                                                    <EditIcon/>
                                                </SvgIcon>
                                            </IconButton>
                                            <IconButton onClick={() => handleEmployeeDelete(employee.id!)}>
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
                labelRowsPerPage={'Количество сотрудников:'}
                rowsPerPage={size}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
            />
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Удалить сотрудника?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleAgree} color="primary">
                        Да
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                        Нет
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}

export default Results;
