import React, {useEffect, useState} from "react";
import {RoadFuelDetail, RoadFuelType} from "../../../model/Road";
import {
    Box, Button, Card,
    IconButton,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import roadService from "../../../services/RoadService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import PerfectScrollbar from "react-perfect-scrollbar";
import {NavLink as RouterLink} from "react-router-dom";
import {setSelectedRoadFuelDetail} from "../../../store/actions/roadActions";
import {Edit as EditIcon} from "react-feather";
import DeleteButton from "../../../components/DeleteButton";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {useParams} from "react-router";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2)
    }
}));

const FuelDetailList: React.FC<{updateRoad: Function, type: RoadFuelType}> = ({updateRoad, type}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const {id: roadId, stuffId} = useParams<{ id: string, stuffId: string }>()
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<RoadFuelDetail[]>([]);

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await roadService.getRoadFuelDetails(Number(roadId), type)

                !cancel && setRows(data)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [roadId, type, enqueueSnackbar]);

    const handleDeleteRow = (index: number) => {
        let newRows = [...rows]

        newRows.splice(index, 1)

        setRows(newRows)
        updateRoad()
    };

    return (
        <Card className={classes.root}>
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    №
                                </TableCell>
                                <TableCell>
                                    Дата
                                </TableCell>
                                <TableCell>
                                    Количество (л)
                                </TableCell>
                                {type === 'ON_ROAD' && (
                                    <>
                                        <TableCell>
                                            Валюта
                                        </TableCell>
                                        <TableCell>
                                            Цена
                                        </TableCell>
                                        <TableCell>
                                            Сумма
                                        </TableCell>
                                    </>
                                )}
                                <TableCell>
                                    Примечание
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    Действия
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows?.length > 0 ? (
                                <TableBody>
                                    {rows.map((row: RoadFuelDetail, index) => (
                                        <TableRow
                                            hover
                                            key={row.id}
                                        >
                                            <TableCell>
                                                {row.id}
                                            </TableCell>
                                            <TableCell>
                                                {row.refuelingDate}
                                            </TableCell>
                                            <TableCell>
                                                {row.liter}
                                            </TableCell>
                                            {type === 'ON_ROAD' && (
                                                <>
                                                    <TableCell>
                                                        {row.unit}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.price}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.totalPrice}
                                                    </TableCell>
                                                </>
                                            )}
                                            <TableCell>
                                                {row.description}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    component={RouterLink}
                                                    to={`/app/roads/${roadId}/${stuffId}/edit`}
                                                    onClick={() => dispatch(setSelectedRoadFuelDetail(row))}
                                                >
                                                    <SvgIcon fontSize="small">
                                                        <EditIcon/>
                                                    </SvgIcon>
                                                </IconButton>
                                                <DeleteButton
                                                    index={index}
                                                    rowId={row.id!}
                                                    onDelete={roadService.deleteRoadFuelDetail}
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
            <Box mt={2} px={2} className={classes.buttons}>
                <Button
                    className={classes.cancelButton}
                    variant="outlined"
                    color="secondary"
                    type="button"
                    to="/app/roads"
                    component={RouterLink}
                >
                    Отмена
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    to={`/app/roads/${roadId}/${stuffId}/create`}
                    component={RouterLink}
                >
                    добавить
                </Button>
            </Box>
        </Card>
    )
}

export default FuelDetailList
