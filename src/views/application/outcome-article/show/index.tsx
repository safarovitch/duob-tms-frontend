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
import {OutcomeByArticleApplication} from "../../../../model/Application";
import PERMISSIONS from "../../../../constants/permissions";
import applicationService from "../../../../services/ApplicationService";
import {deleteSelectedOutcomeArticle, setSelectedOutcomeArticle} from "../../../../store/actions/applicationAction";
import hasPermission from "../../../../hooks/hasPermisson";
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
    const canApprove = hasPermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.APPROVE)
    const canAddPhoto = hasPermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.ADD_PHOTO)
    const outcomeArticle = useSelector((state: { selectedApplicationOutcomeArticle: OutcomeByArticleApplication }) => state.selectedApplicationOutcomeArticle)

    useEffect(() => () => {
        dispatch(deleteSelectedOutcomeArticle())
    }, [dispatch])

    if (!outcomeArticle) {
        history.go(-1);
        return null;
    }

    const handleApprove = (data: OutcomeByArticleApplication) => {
        dispatch(setSelectedOutcomeArticle(data))
        dispatch(needUpdateWarehouseBalance())
    }

    const handleAddImage = (images: string) => {
        const newOutcomeArticle = {...outcomeArticle, images}
        dispatch(setSelectedOutcomeArticle(newOutcomeArticle))
    }

    const isPaid = (): boolean => outcomeArticle.status === ApplicationStatusEnum.PAID;

    return (
        <Page title={`Заявка №${outcomeArticle.id}`}>
            <Container className={classes.root} maxWidth="md">
                <Header outcomeArticle={outcomeArticle}/>
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
                                    {outcomeArticle.createdDate}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box my={3}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4">
                                    Сотрудник:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    {`${outcomeArticle.employee?.name} #${outcomeArticle.employee?.id}`}
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
                                            Расход по сатьям:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            {outcomeArticle.article?.name}
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
                                    applicationId={outcomeArticle.id!}
                                    currencyExchangeData={outcomeArticle}
                                    onApprove={applicationService.approveOutcomeArticle}
                                    handleApprove={handleApprove}
                                />
                            ) : (
                                <Grid container alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4">
                                            Расход по сатьям:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1">
                                            Статья: {outcomeArticle.article?.name}
                                        </Typography>
                                        <Typography variant="body1">
                                            Сумма: <b>{`${outcomeArticle.actualAmount} ${outcomeArticle.actualMoneyUnit}`}</b>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <b>{`${outcomeArticle.convertAmount} ${outcomeArticle.convertMoneyUnit}`}</b>
                                        </Typography>
                                        <Typography variant="body1">
                                            Курс конвертации: <b>{outcomeArticle.currency}</b>
                                        </Typography>
                                        <Typography variant="body1">
                                            Итого: <b>{outcomeArticle.totalAmount} {Currency.USD}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Box>
                    <Divider />
                    <Box my={4}>
                        <UploadImage images={outcomeArticle.images!} canAddPhoto={canAddPhoto} applicationId={outcomeArticle.id!} onAddImage={handleAddImage} />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

export default ShowView;

