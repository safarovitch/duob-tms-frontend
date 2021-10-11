import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {
    Box,
    Card,
    Container,
    Divider,
    Grid,
    makeStyles,
    Typography
} from "@material-ui/core";
import Page from "../../../../components/Page";
import Header from "./Header";
import {IncomeByArticleApplication} from "../../../../model/Application";
import PERMISSIONS from "../../../../constants/permissions";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import applicationService from "../../../../services/Application";
import {deleteSelectedIncomeArticle, setSelectedIncomeArticle} from "../../../../store/actions/applicationAction";
import usePermission from "../../../../hooks/usePermission";
import UploadImage from "../../components/UploadImage";
import ApproveApplication from "../../components/ApproveApplication";

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
    }
}));

const ShowView: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const canApprove = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.APPROVE)
    const canAddPhoto = usePermission(PERMISSIONS.APPLICATION.INCOME_ARTICLE.ADD_PHOTO)
    const [loading, setLoading] = useState(false)
    const incomeArticle = useSelector((state: { selectedApplicationIncomeArticle: IncomeByArticleApplication }) => state.selectedApplicationIncomeArticle)

    useEffect(() => () => {
        dispatch(deleteSelectedIncomeArticle())
    }, [])

    if (!incomeArticle) {
        history.go(-1);
        return null;
    }

    const handleApproveApplication = async () => {
        try {
            setLoading(true)

            const fetchIncomeArticle: any = await applicationService.approveIncomeArticle(incomeArticle.id!)

            dispatch(setSelectedIncomeArticle(fetchIncomeArticle))
            enqueueSnackbar('Успешно подтверждено', {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const handleAddImage = (images: string) => {
        const newIncomeArticle = {...incomeArticle, images}
        dispatch(setSelectedIncomeArticle(newIncomeArticle))
    }

    const isPaidApplication = (row: IncomeByArticleApplication): boolean => row.status === 'PAID';

    return (
        <Page title={`Заявка №${incomeArticle.id}`}>
            <Container className={classes.root} maxWidth="md">
                <Header incomeArticle={incomeArticle}/>
                <Card className={classes.mainContent}>
                    <Box mb={2}>
                        <ApproveApplication isPaid={isPaidApplication(incomeArticle)} canApprove={canApprove} loading={loading} onApproveApplication={handleApproveApplication} />
                    </Box>
                    <Divider />

                    <Box mt={3}>
                        <Grid container alignItems="center">
                            <Grid xs={12} sm={6}>
                                <Typography variant="h4">
                                    Дата заявки:
                                </Typography>
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <Typography variant="body1">
                                    {incomeArticle.createdDate}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box my={3}>
                        <Grid container alignItems="center">
                            <Grid xs={12} sm={6}>
                                <Typography variant="h4">
                                    Менеджер:
                                </Typography>
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <Typography variant="body1">
                                    {`${incomeArticle.createdBy?.name} #${incomeArticle.createdBy?.id}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box mt={3} mb={4}>
                        <Grid container alignItems="center">
                            <Grid xs={12} sm={6}>
                                <Typography variant="h4">
                                    Приход по статьям:
                                </Typography>
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <Typography variant="body1">
                                    Статья: {incomeArticle.article?.name}
                                </Typography>
                                <Typography variant="body1">
                                    <b>Сумма: {incomeArticle.amount}</b>
                                </Typography>
                                <Typography variant="body1">
                                    <b>Валюта: {incomeArticle.moneyUnit}</b>
                                </Typography>
                            </Grid>
                        </Grid>
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
