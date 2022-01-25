import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {useParams} from "react-router";
import customerService from "../../../../../services/CustomerService";
import errorMessageHandler from "../../../../../utils/errorMessageHandler";
import PerfectScrollbar from "react-perfect-scrollbar";
import NoFoundTableBody from "../../../../../components/NoFoundTableBody";
import {Credit} from "../../../../../model/Customer";
import {Currency} from "../../../../../constants";
import {Close as CloseIcon, DoneAll as DoneAllIcon} from "@material-ui/icons";
import AdminApproveButton from "../../../../application/components/AdminApproveButton";
import usePermission from "../../../../../hooks/usePermission";
import PERMISSIONS from "../../../../../constants/permissions";
import {MoreHorizontal as MoreHorizontalIcon} from "react-feather";
import {needUpdateWarehouseBalance} from "../../../../../store/actions/warehouseActions";
import {useDispatch} from "react-redux";
import CreditHistory from "./CreditHistory";
import CreditPaid from "./CreditPaid";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    statusPaid: {
        color: 'green',
        fontWeight: 600
    },
    statusWaiting: {
        color: 'red',
        fontWeight: 600
    }
}));

const CreditListView: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [rows, setRows] = useState<Credit[]>([])
    const [loading, setLoading] = useState(false)
    const {id: customerId} = useParams<{id: string}>()
    const canAdminApprove = usePermission(PERMISSIONS.CUSTOMER.CREDIT.ADMIN_APPROVE)
    const canCashierApprove = usePermission(PERMISSIONS.CUSTOMER.CREDIT.CASHIER_APPROVE)
    const canPaid = usePermission(PERMISSIONS.CUSTOMER.CREDIT.PAID)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await customerService.getCredits(customerId, page, size)

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
    }, [enqueueSnackbar, customerId, page, size])

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist();
        setSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleAdminApprove = (index: number) => {
        rows[index].adminApproval = true
        setRows([...rows])
    }

    const handleCashierApprove = (index: number) => {
        rows[index].cashierApproval = true
        rows[index].balance = rows[index].amount
        setRows([...rows])
        dispatch(needUpdateWarehouseBalance())
    }

    const handlePaid = (index: number, credit: Credit) => {
        rows[index] = credit
        setRows([...rows])
        dispatch(needUpdateWarehouseBalance())
    }

    return (
        <Card className={classes.root}>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table size="small">
                        <TableHead >
                            <TableRow >
                                <TableCell>Дата</TableCell>
                                <TableCell>Задолжность</TableCell>
                                <TableCell>Менеджер</TableCell>
                                <TableCell>Склад</TableCell>
                                <TableCell align="center">Админ</TableCell>
                                <TableCell align="center">Кассир</TableCell>
                                <TableCell>Оплачено</TableCell>
                                <TableCell>Коментарии</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        {
                            rows.length > 0 ? (
                                <TableBody>
                                    {
                                        rows.map((row, index) => (
                                            <TableRow hover key={index}>
                                                <TableCell>{row.createdDate}</TableCell>
                                                <TableCell>{row.amount} {Currency.USD}</TableCell>
                                                <TableCell>{row.createdBy}</TableCell>
                                                <TableCell>{row.warehouseName}</TableCell>
                                                <TableCell align="center">
                                                    {
                                                        row.adminApproval ? <DoneAllIcon className={classes.statusPaid} /> : (
                                                            canAdminApprove ? (
                                                                <AdminApproveButton
                                                                    index={index}
                                                                    rowId={row.id!}
                                                                    approveAdminApplication={customerService.approveAdminApplication}
                                                                    onApprove={handleAdminApprove}
                                                                />
                                                            ) : <CloseIcon className={classes.statusWaiting} />
                                                        )
                                                    }
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        row.adminApproval ? (
                                                            row.cashierApproval ? <DoneAllIcon className={classes.statusPaid} /> : (
                                                                canCashierApprove ? (
                                                                    <AdminApproveButton
                                                                        index={index}
                                                                        rowId={row.id!}
                                                                        approveAdminApplication={customerService.approveCashierApplication}
                                                                        onApprove={handleCashierApprove}
                                                                    />
                                                                ) : <MoreHorizontalIcon />
                                                            )
                                                        ) : <MoreHorizontalIcon />
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <CreditPaid
                                                        index={index}
                                                        credit={row}
                                                        canPaid={canPaid && row.adminApproval && row.cashierApproval}
                                                        onPaid={customerService.paidCredit}
                                                        handlePaid={handlePaid}
                                                    />
                                                </TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell>
                                                    <CreditHistory creditId={row.id} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
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
                labelRowsPerPage={'Строк на странице:'}
                rowsPerPage={size}
                rowsPerPageOptions={[10, 15, 25]}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
            />
        </Card>
    )
}

export default CreditListView