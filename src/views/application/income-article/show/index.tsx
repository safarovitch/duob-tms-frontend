import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    Box, Button,
    Card,
    Container,
    Divider,
    Grid,
    makeStyles, SvgIcon,
    Typography
} from "@material-ui/core";
import Page from "../../../../components/Page";
import Header from "./Header";
import {IncomeByArticleApplication} from "../../../../model/Application";
import PERMISSIONS from "../../../../constants/permissions";
import applicationService from "../../../../services/Application";
import {deleteSelectedIncomeArticle, setSelectedIncomeArticle} from "../../../../store/actions/applicationAction";
import usePermission from "../../../../hooks/usePermission";
import UploadImage from "../../components/UploadImage";
import {needUpdateWarehouseBalance} from "../../../../store/actions/warehouseActions";
import {ApplicationStatusEnum, Currency} from "../../../../constants";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import CashierApprove from "../../components/CashierApprove";

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
    mb1: {
        marginBottom: '8px',
    },
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    },
}));

const ShowView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const canApprove = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.APPROVE)
    const canAddPhoto = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.ADD_PHOTO)
    const incomeArticle = useSelector((state: { selectedApplicationIncomeArticle: IncomeByArticleApplication }) => state.selectedApplicationIncomeArticle)

    useEffect(() => () => {
        dispatch(deleteSelectedIncomeArticle())
    }, [dispatch])

    if (!incomeArticle) {
        history.go(-1);
        return null;
    }

    const handleApprove = (data: IncomeByArticleApplication) => {
        dispatch(setSelectedIncomeArticle(data))
        dispatch(needUpdateWarehouseBalance())
    }

    const handleAddImage = (images: string) => {
        const newIncomeArticle = {...incomeArticle, images}
        dispatch(setSelectedIncomeArticle(newIncomeArticle))
    }

    const isPaid = (): boolean => incomeArticle.status === ApplicationStatusEnum.PAID;

    return (
        <Page title={`Заявка №${incomeArticle.id}`}>
            <Container className={classes.root} maxWidth="md">
                <Header incomeArticle={incomeArticle}/>
                <Card className={classes.mainContent}>
                    <Box mb={2}>
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={() => history.go(-1)}
                            className={classes.action}
                        >
                            <SvgIcon
                                fontSize="small"
                                className={classes.actionIcon}
                            >
                                <NavigateBeforeIcon />
                            </SvgIcon>
                            Назад
                        </Button>
                    </Box>
                    <Divider />
                    <Box mt={3}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4">
                                    Дата заявки:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    {incomeArticle.createdDate}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box my={3}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4">
                                    Менеджер:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    {`${incomeArticle.createdBy?.name} #${incomeArticle.createdBy?.id}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    {
                        !isPaid() && canApprove && (
                            <Box mb={3}>
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4">
                                            Приход по статьям:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            {incomeArticle.article?.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                    }
                    <Divider />
                    <Box mt={3} mb={4}>
                        {
                            !isPaid() && canApprove ? (
                                <CashierApprove
                                    applicationId={incomeArticle.id!}
                                    currencyExchangeData={incomeArticle}
                                    onApprove={applicationService.approveIncomeArticle}
                                    handleApprove={handleApprove}
                                />
                            ) : (
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4">
                                            Приход по статьям:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            Статья: {incomeArticle.article?.name}
                                        </Typography>
                                        <Typography variant="body1">
                                            Сумма: <b>{`${incomeArticle.actualAmount} ${incomeArticle.actualMoneyUnit}`}</b>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <b>{`${incomeArticle.convertAmount} ${incomeArticle.convertMoneyUnit}`}</b>
                                        </Typography>
                                        <Typography variant="body1">
                                            Курс конвертации: <b>{incomeArticle.currency}</b>
                                        </Typography>
                                        <Typography variant="body1">
                                            Итого: <b>{incomeArticle.totalAmount} {Currency.USD}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Box>
                    <Divider />
                    <Box my={4}>
                        <UploadImage images={incomeArticle.images!} canAddPhoto={canAddPhoto} applicationId={incomeArticle.id!} onAddImage={handleAddImage} />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

export default ShowView;
