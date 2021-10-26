import React, {useEffect, useState} from "react";
import {CargoIssueResponse} from "../../../../model/Cargo";
import cargoService from "../../../../services/CargoService";
import {useParams} from "react-router";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import Page from "../../../../components/Page";
import LoadingLayout from "../../../../components/LoadingLayout";
import Header from "./Header";
import {
    Box, Button,
    Card, CircularProgress,
    Container,
    Grid,
    makeStyles, SvgIcon,
    Table, TableBody, TableCell,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@material-ui/core";
import {
    mapOfStatusCargoIssue,
    mapOfStatusColorCargoIssue
} from "../../../../constants";
import PerfectScrollbar from "react-perfect-scrollbar";
import ConfirmModal from "../../../../components/ConfirmModal";
import {Done as DoneIcon} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import usePermission from "../../../../hooks/usePermission";
import PERMISSIONS from "../../../../constants/permissions";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    mainContent: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
    loadingProgress: {
        position: 'absolute',
        top: '50%',
        left: '14px',
        marginTop: '-14px',
    }
}));

const IssueShow: React.FC = () => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {id: cargoIssueId} = useParams<{id: string}>()
    const [cargoIssue, setCargoIssue] = useState<CargoIssueResponse>()
    const [hasError, setHasError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingApprove, setLoadingApprove] = useState(false)
    const [isConfirmModalOpen, setOpen] = useState(false)
    const canApprove = usePermission(PERMISSIONS.CARGO.ISSUES.APPROVE)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)

                const data: any = await cargoService.getCargoIssue(Number(cargoIssueId))

                setCargoIssue(data)
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const handleAccept = async () => {
        try {
            setOpen(false)
            setLoadingApprove(true)

            const data: any = await cargoService.approveCargoIssue(cargoIssue?.id!)

            setCargoIssue(data)
            enqueueSnackbar('Успешно подтверждено', {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoadingApprove(false)
        }
    }

    return (
        <Page title={cargoIssue ? `Клиент ${cargoIssue.client.code}` : 'Выдача груза'}>
            {
                cargoIssue ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header cargoIssue={cargoIssue}/>
                        <Card className={classes.mainContent}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <Typography variant="h5"><b>{cargoIssue.createdDate}</b></Typography>
                                </Grid>
                                <Grid item>
                                    {
                                        !cargoIssue.approvalBy && canApprove ? (
                                            <Box style={{position: 'relative'}}>
                                                <Button
                                                    color="secondary"
                                                    variant="contained"
                                                    onClick={() => setOpen(true)}
                                                    disabled={loadingApprove}
                                                    size="small"
                                                >
                                                    <SvgIcon
                                                        fontSize="small"
                                                        className={classes.actionIcon}
                                                    >
                                                        {!loadingApprove && <DoneIcon />}
                                                    </SvgIcon>
                                                    Подтвердить
                                                </Button>
                                                {loadingApprove && <CircularProgress size={20} className={classes.loadingProgress} />}
                                            </Box>
                                        ) : (
                                            <Button
                                                color="secondary"
                                                variant="outlined"
                                                onClick={() => history.go(-1)}
                                            >
                                                <SvgIcon fontSize="small" className={classes.actionIcon}>
                                                    <NavigateBeforeIcon />
                                                </SvgIcon>
                                                Назад
                                            </Button>
                                        )
                                    }
                                </Grid>
                            </Grid>
                            <Box mt={2}>
                                <Grid container>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="h5">
                                            Статус:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">
                                            <b><span style={{color: mapOfStatusColorCargoIssue.get(cargoIssue.status)}}>{mapOfStatusCargoIssue.get(cargoIssue.status)}</span></b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mt={2}>
                                <Grid container>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="h5">
                                            Код клиента:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">
                                            <b>{cargoIssue.client.code}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mt={2}>
                                <Grid container>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="h5">
                                            Завсклад:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">
                                            <b>{cargoIssue.createdBy.name}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mt={2}>
                                <Grid container>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="h5">
                                            Менеджер:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">
                                            {
                                                cargoIssue.approvalBy ? (<b>{cargoIssue.approvalBy?.name}</b>) : '-'
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mt={2}>
                                <Card>
                                    <PerfectScrollbar>
                                        <Box minWidth={700}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>№</TableCell>
                                                        <TableCell>Дата</TableCell>
                                                        <TableCell>Груз</TableCell>
                                                        <TableCell>Вид груза</TableCell>
                                                        <TableCell>Д / Ш / В</TableCell>
                                                        <TableCell>Обьем(м3)</TableCell>
                                                        <TableCell>Вес(кг)</TableCell>
                                                        <TableCell>Штрих-код</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {cargoIssue.cargos!.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{++index}</TableCell>
                                                            <TableCell>{row.createdDate}</TableCell>
                                                            <TableCell>
                                                                {
                                                                    row.groupCargo ? (
                                                                        <Tooltip title="Сборный груз" placement="top">
                                                                            <span style={{color: '#5850EC'}}>{row.product}</span>
                                                                        </Tooltip>
                                                                    ) : row.product
                                                                }
                                                            </TableCell>
                                                            <TableCell>{row.type}</TableCell>
                                                            <TableCell>{row.lengthCargo} / {row.widthCargo} / {row.heightCargo}</TableCell>
                                                            <TableCell>{row.totalVolume}</TableCell>
                                                            <TableCell>{row.wightCargo}</TableCell>
                                                            <TableCell>{row.barcode}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </PerfectScrollbar>
                                </Card>
                            </Box>
                            <Box mt={3}>
                                <Grid container spacing={3}>
                                    <Grid item>
                                        <Typography variant="h5">
                                            Грузы на сумму: <b>{cargoIssue.actualAmount} $</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h5">
                                            Баланс: <b>{cargoIssue.client.balance} $</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                        <ConfirmModal
                            isOpen={isConfirmModalOpen}
                            title={'Вы уверены, что хотите подтвердить заявку?'}
                            description={'При подтверждении заявки, его нельзя будет отменить. Пожалуйста, убедитесь, что вы хотите подтвердить именно эту заявку.'}
                            onClose={() => setOpen(false)}
                            onAccept={handleAccept}
                        />
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    )
}

export default IssueShow
