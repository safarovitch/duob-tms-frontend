import React, {useEffect, useReducer, useState} from "react";
import {
    Box, Button,
    Card,
    Chip,
    Container, Dialog,
    Grid, IconButton,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import employeeService from "../../../services/EmployeeService";
import {Edit as EditIcon, MoreHorizontal as MoreHorizontalIcon, Printer as PrinterIcon} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import {NavLink as RouterLink} from "react-router-dom";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {Accountability, EmployeeAccountabilityResponse} from "../../../model/Employee";
import Page from "../../../components/Page";
import moment from "moment";
import hasPermission from "../../../hooks/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import {useParams} from "react-router";
import {AccountabilityType, Currency, mapOfAccountabilityType} from "../../../constants";
import DeleteButton from "../../../components/DeleteButton";
import {DoneAll as DoneAllIcon} from "@material-ui/icons";
import AdminApproveButton from "../../application/components/AdminApproveButton";
import DoneIcon from "@material-ui/icons/Done";
import Header from "./Header";
import {useDispatch} from "react-redux";
import {setSelectedEmployeeAccountability} from "../../../store/actions/employeeActions";
import LoadingLayout from "../../../components/LoadingLayout";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import {PDFViewer} from "@react-pdf/renderer";
import AccountabilityPDF from "./AccountabilityPDF";
import ImageModal from "./ImageModal";
import {needUpdateWarehouseBalance} from "../../../store/actions/warehouseActions";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    approved: {
        color: 'green',
        fontWeight: 600
    },
}));

const AccountabilityListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [selectedType, setSelectedType] = useState<AccountabilityType | null>(null)
    const {employeeId} = useParams<{employeeId: string}>()
    const [rows, setRows] = useState<Accountability[]>([])
    const [loading, setLoading] = useState(false)
    const [employeeLoading, setEmployeeLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [employee, setEmployee] = useState<EmployeeAccountabilityResponse>()
    const [viewPDF, setViewPDF] = useState(false)
    const [accountability, setAccountability] = useState<Accountability>()
    const canDelete = hasPermission(PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.DELETE)
    const canEdit = hasPermission(PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.EDIT)
    const canAdminApprove = hasPermission(PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.ADMIN_APPROVE)
    const canApprove = hasPermission(PERMISSIONS.EMPLOYEE.ACCOUNTABILITY.APPROVE)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setEmployeeLoading(true)

                const data: any = await employeeService.getEmployeeById(Number(employeeId))

                !cancel && setEmployee(data)
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setEmployeeLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [employeeId, enqueueSnackbar])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await employeeService.getFilteredEmployeeAccount(Number(employeeId), page, size, startDate, endDate, selectedType)

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
    }, [updateRows, enqueueSnackbar, employeeId, page, size, startDate, endDate, selectedType])

    const handleStartDateChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setStartDate(event.target.value)
        setPage(1)
    }

    const handleEndDateChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setEndDate(event.target.value)
        setPage(1)
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    }

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    }

    const handleSelectType = (type: AccountabilityType) => {
        if (selectedType === type) setSelectedType(null)
        else setSelectedType(type)

        setPage(1)
    }

    const handleAdminApprove = (index: number) => {
        rows[index].adminConfirmation = true
        setRows([...rows])
    }

    const handleApprove = (index: number) => {
        rows[index].cashierConfirmation = true
        setRows([...rows])
        dispatch(needUpdateWarehouseBalance())
    }

    const handleDeleteRow = () => {
        setPage(1)
        setUpdateRows()
    }

    const handleUpdateImage = (accountabilityId: number, filePath: string) => {
        let newRows = [...rows]
        let index = newRows.findIndex((item) => item.id === accountabilityId)

        if (index > -1) newRows[index].filePath = filePath

        setRows(newRows)
    }

    return (
        <Page title={employee?.name || 'Подотчет'}>
            {
                employee ? (
                    <Container className={classes.root} maxWidth="xl">
                        <Header employee={employee} />
                        <Box mt={3}>
                            <Card>
                                <Box py={3} px={2}>
                                    <Box mb={3}>
                                        <Typography variant="h5">
                                            Остаток: <b>{employee.secondaryBalance} {employee.secondaryMoneyUnit} {employee.balanceUSD} {Currency.USD}</b>
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Grid container spacing={2}>
                                                <Grid item>
                                                    <TextField
                                                        fullWidth
                                                        type="date"
                                                        label="От"
                                                        onChange={handleStartDateChange}
                                                        value={startDate}
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <TextField
                                                        fullWidth
                                                        type="date"
                                                        label="До"
                                                        onChange={handleEndDateChange}
                                                        value={endDate}
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        size="small"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container spacing={1}>
                                                {(Object.keys(AccountabilityType) as Array<keyof typeof AccountabilityType>).map((type, index) => (
                                                    <Grid item key={index}>
                                                        {selectedType === type ? (
                                                            <Chip
                                                                label={mapOfAccountabilityType.get(AccountabilityType[type])}
                                                                clickable
                                                                color="primary"
                                                                onClick={() => handleSelectType(AccountabilityType[type])}
                                                                onDelete={() => handleSelectType(AccountabilityType[type])}
                                                                deleteIcon={<DoneIcon />}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label={mapOfAccountabilityType.get(AccountabilityType[type])}
                                                                clickable
                                                                onClick={() => handleSelectType(AccountabilityType[type])}
                                                            />
                                                        )}
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <PerfectScrollbar>
                                    <Box minWidth={700}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Дата</TableCell>
                                                    <TableCell>Сумма USD</TableCell>
                                                    <TableCell>Сумма</TableCell>
                                                    <TableCell>Курс конвертации</TableCell>
                                                    <TableCell>Итого</TableCell>
                                                    <TableCell>Действие</TableCell>
                                                    <TableCell>Менеджер</TableCell>
                                                    <TableCell align="center">Админ</TableCell>
                                                    <TableCell align="center">Кассир</TableCell>
                                                    <TableCell>Примечание</TableCell>
                                                    <TableCell />
                                                </TableRow>
                                            </TableHead>
                                            {
                                                rows.length > 0 ? (
                                                    <TableBody>
                                                        {rows.map((row: Accountability, index) => (
                                                            <TableRow hover key={row.id}>
                                                                <TableCell>{row.updatedDate}</TableCell>
                                                                <TableCell>{row.actualAmount} {row.actualMoneyUnit}</TableCell>
                                                                <TableCell>{row.convertAmount} {row.convertMoneyUnit}</TableCell>
                                                                <TableCell>{row.currency}</TableCell>
                                                                <TableCell>{row.totalAmount}</TableCell>
                                                                <TableCell>{mapOfAccountabilityType.get(row.type)}</TableCell>
                                                                <TableCell>{row.createdByName}</TableCell>
                                                                <TableCell align="center">
                                                                    {
                                                                        row.adminConfirmation ? <DoneAllIcon className={classes.approved} /> : (
                                                                            canAdminApprove ? (
                                                                                <AdminApproveButton
                                                                                    index={index}
                                                                                    rowId={row.id!}
                                                                                    approveAdminApplication={employeeService.approveEmployeeAccountabilityByAdmin}
                                                                                    onApprove={handleAdminApprove}
                                                                                />
                                                                            ) : <MoreHorizontalIcon />
                                                                        )
                                                                    }
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {
                                                                        row.cashierConfirmation ? <DoneAllIcon className={classes.approved} /> : (
                                                                            canApprove ? (
                                                                                <AdminApproveButton
                                                                                    index={index}
                                                                                    rowId={row.id!}
                                                                                    approveAdminApplication={employeeService.approveEmployeeAccountabilityByCashier}
                                                                                    onApprove={handleApprove}
                                                                                />
                                                                            ) : <MoreHorizontalIcon />
                                                                        )
                                                                    }
                                                                </TableCell>
                                                                <TableCell>{row.description}</TableCell>
                                                                <TableCell align="center">
                                                                    <ImageModal
                                                                        accountability={row}
                                                                        handleUpdate={handleUpdateImage}
                                                                    />
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setAccountability(row)
                                                                            setViewPDF(true)
                                                                        }}
                                                                    >
                                                                        <SvgIcon fontSize="small">
                                                                            <PrinterIcon />
                                                                        </SvgIcon>
                                                                    </IconButton>
                                                                    {!row.cashierConfirmation && canEdit && (
                                                                        <IconButton
                                                                            component={RouterLink}
                                                                            to={`/app/employee-accounts/${employeeId}/edit`}
                                                                            onClick={() => dispatch(setSelectedEmployeeAccountability(row))}
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
                                                                            onDelete={employeeService.deleteEmployeeAccountability}
                                                                            handleDelete={handleDeleteRow}
                                                                        />
                                                                    )}
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
                                    labelRowsPerPage={'Количество складов:'}
                                    rowsPerPage={size}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                    labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                                />
                                <Dialog fullScreen open={viewPDF}>
                                    <Box height="100%" display="flex" flexDirection="column">
                                        <Box bgcolor="common.white" p={2}>
                                            <Button variant="contained" color="secondary" onClick={() => setViewPDF(false)}>
                                                <NavigateBeforeIcon />
                                                Назад
                                            </Button>
                                        </Box>
                                        <Box flexGrow={1}>
                                            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                                                <AccountabilityPDF accountability={accountability!} />
                                            </PDFViewer>
                                        </Box>
                                    </Box>
                                </Dialog>
                            </Card>
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={employeeLoading} hasError={hasError}/>
            }
        </Page>
    )
}

export default AccountabilityListView