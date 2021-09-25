import React, {useEffect} from 'react';
import * as Yup from 'yup';
import {Formik, FormikProps} from 'formik';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    makeStyles,
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Article} from "../../../model/Article";
import articleService from "../../../services/ArticleService";
import {deleteSelectedArticleIncome} from "../../../store/actions/articleActions";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {ARTICLES} from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {},
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2)
    }
}));

const ArticleIncomeForm: React.FC<{articleIncome: Article}> = ({articleIncome}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(deleteSelectedArticleIncome())
    }, [])

    const initialValues: Article = {
        name: articleIncome?.name || '',
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
    })

    const handleAddProduct = async (values: Article, formActions: { [key: string]: any }) => {
        try {
            await articleService.postArticle(ARTICLES.INCOME_POSTFIX, values)

            enqueueSnackbar('Статья создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdateProduct = async (values: Article, formActions: { [key: string]: any }) => {
        try {
            values.id = articleIncome?.id;

            await articleService.updateArticle(values)

            enqueueSnackbar('Статья обновлен', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={!articleIncome ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                articleIncome ? await handleUpdateProduct(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleAddProduct(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<Article>) => (
                <form
                    className={classes.root}
                    onSubmit={props.handleSubmit}
                >
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.name && props.errors.name)}
                                        fullWidth
                                        helperText={props.touched.name && props.errors.name}
                                        label="Введите Наименование"
                                        name="name"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.name}
                                        variant="outlined"
                                        required
                                        autoFocus
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={2} pb={1} className={classes.buttons}>
                                <Button
                                    className={classes.cancelButton}
                                    variant="outlined"
                                    color="secondary"
                                    type="button"
                                    disabled={props.isSubmitting}
                                    onClick={() => history.go(-1)}
                                >
                                    Отмена
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={props.isSubmitting}
                                >
                                    {articleIncome ? 'Сохранить' : 'Добавить'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default ArticleIncomeForm;
