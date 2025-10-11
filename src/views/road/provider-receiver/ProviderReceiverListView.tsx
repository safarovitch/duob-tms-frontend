import React, {useEffect, useReducer, useState} from "react";
import {
    Box, Card, Chip, Grid,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow
} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {ProviderReceiver} from "../../../model/Road";
import roadService from "../../../services/RoadService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {mapOfProviderReceiverEnum, ProviderReceiverEnum} from "../../../constants";
import PerfectScrollbar from "react-perfect-scrollbar";
import DeleteButton from "../../../components/DeleteButton";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import DoneIcon from "@material-ui/icons/Done";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
}));

const ProviderReceiverListView: React.FC = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0)
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<ProviderReceiver[]>([]);
    const [selectedType, setSelectedType] = useState<ProviderReceiverEnum | null>(null)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await roadService.getFilteredProviderReceiver(page, size, selectedType)

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
    }, [updateRows, enqueueSnackbar, page, size, selectedType]);

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

    const handleSelectType = (type: ProviderReceiverEnum) => {
        if (selectedType === type) setSelectedType(null)
        else setSelectedType(type)

        setPage(1)
    }

    return (
        <Card className={classes.root}>
            <Box mb={2} px={2}>
                <Grid container spacing={1}>
                    {Object.keys(ProviderReceiverEnum).map((key, index) => (
                        <Grid item key={index}>
                            {selectedType === ProviderReceiverEnum[key as ProviderReceiverEnum] ? (
                                <Chip
                                    label={mapOfProviderReceiverEnum.get(ProviderReceiverEnum[key as ProviderReceiverEnum])}
                                    clickable
                                    color="primary"
                                    onClick={() => handleSelectType(key as ProviderReceiverEnum)}
                                    onDelete={() => handleSelectType(key as ProviderReceiverEnum)}
                                    deleteIcon={<DoneIcon />}
                                />
                            ) : (
                                <Chip
                                    label={mapOfProviderReceiverEnum.get(ProviderReceiverEnum[key as ProviderReceiverEnum])}
                                    clickable
                                    onClick={() => handleSelectType(key as ProviderReceiverEnum)}
                                />
                            )}
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Тип</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>ИНН</TableCell>
                                <TableCell>Адрес</TableCell>
                                <TableCell>Страна</TableCell>
                                <TableCell align="center" width="15%">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows?.length > 0 ? (
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell>{mapOfProviderReceiverEnum.get(row.type)}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.inn}</TableCell>
                                            <TableCell>{row.address}</TableCell>
                                            <TableCell>{row.country}</TableCell>
                                            <TableCell align="center">
                                                <DeleteButton
                                                    index={index}
                                                    rowId={row.id!}
                                                    onDelete={roadService.deleteProviderReceiver}
                                                    handleDelete={handleDeleteRow}
                                                />
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
                labelRowsPerPage={'Строк на странице:'}
                rowsPerPage={size}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
            />
        </Card>
    )
}

export default ProviderReceiverListView