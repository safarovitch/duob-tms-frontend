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
import {OutcomeByArticleApplication} from "../../../../model/Application";
import PERMISSIONS from "../../../../constants/permissions";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import applicationService from "../../../../services/Application";
import {deleteSelectedOutcomeArticle, setSelectedOutcomeArticle} from "../../../../store/actions/applicationAction";
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
    const outcomeArticle = useSelector((state: { selectedApplicationOutcomeArticle: OutcomeByArticleApplication }) => state.selectedApplicationOutcomeArticle)

    useEffect(() => () => {
        dispatch(deleteSelectedOutcomeArticle())
    }, [])

    if (!outcomeArticle) {
        history.go(-1);
        return null;
    }

    const handleApproveApplication = async () => {
        try {
            setLoading(true)

            const fetchOutcomeArticle: any = await applicationService.approveOutcomeArticle(outcomeArticle.id!)

            dispatch(setSelectedOutcomeArticle(fetchOutcomeArticle))
            enqueueSnackbar('Успешно подтверждено', {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const handleAddImage = (images: string) => {
        const newOutcomeArticle = {...outcomeArticle, images}
        dispatch(setSelectedOutcomeArticle(newOutcomeArticle))
    }

    const isPaidApplication = (row: OutcomeByArticleApplication): boolean => row.status === 'PAID';

    return (
        <Page title={`Заявка №${outcomeArticle.id}`}>
            <Container className={classes.root} maxWidth="md">
                <Header outcomeArticle={outcomeArticle}/>
                <Card className={classes.mainContent}>
                    <Box mb={2}>
                        <ApproveApplication isPaid={isPaidApplication(outcomeArticle)} canApprove={canApprove} loading={loading} onApproveApplication={handleApproveApplication} />
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
                    <Divider />
                    <Box mt={3} mb={4}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h4">
                                    Расход по сатьям:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1">
                                    Статья: {outcomeArticle.articleName}
                                </Typography>
                                <Typography variant="body1">
                                    <b>Сумма: {outcomeArticle.amount}</b>
                                </Typography>
                                <Typography variant="body1">
                                    <b>Валюта: {outcomeArticle.moneyUnit}</b>
                                </Typography>
                            </Grid>
                        </Grid>
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

