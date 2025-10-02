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
    makeStyles, MenuItem,
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {deleteSelectedIncomeArticle} from "../../../store/actions/applicationAction";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Autocomplete} from "@material-ui/lab";
import {IncomeByArticleApplication, IncomeByArticleFormProps} from "../../../model/Application";
import applicationService from "../../../services/Application";
import {Currency} from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    },
    cancelButton: {
        marginRight: theme.spacing(2)
    }
}));

const CreateOrEditForm: React.FC<IncomeByArticleFormProps> = ({incomeArticle, articles}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => () => {
        dispatch(deleteSelectedIncomeArticle())
    }, [dispatch])

    const initialValues: IncomeByArticleApplication = {
        article: incomeArticle?.article,
        articleId: incomeArticle?.article?.id || 0,
        actualAmount: incomeArticle?.actualAmount || 0,
        actualMoneyUnit: incomeArticle?.actualMoneyUnit || '',
        description: incomeArticle?.description,
    }

    const validationSchema = Yup.object().shape({
        actualAmount: Yup.number().typeError('Значение должно быть числом'),
        description: Yup.string().max(255)
    })

    const handleCreate = async (values: IncomeByArticleApplication, formActions: { [key: string]: any }) => {
        try {
            await applicationService.postIncomeArticle(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: IncomeByArticleApplication, formActions: { [key: string]: any }) => {
        try {
            values.id = incomeArticle?.id;

            await applicationService.updateIncomeArticle(values)

            enqueueSnackbar('Успешно обновлено', {variant: 'success'});
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
            validationSchema={!incomeArticle ? validationSchema : null}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                incomeArticle ? await handleUpdate(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleCreate(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<IncomeByArticleApplication>) => (
                <form
                    onSubmit={props.handleSubmit}
                >
                    <Card className={classes.root}>
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                >
                                    <TextField
                                        error={Boolean(props.touched.actualAmount && props.errors.actualAmount)}
                                        fullWidth
                                        helperText={props.touched.actualAmount && props.errors.actualAmount}
                                        label="Введите сумму"
                                        placeholder="0"
                                        name="actualAmount"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.actualAmount || ''}
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                >
                                    <TextField
                                        select
                                        error={Boolean(props.touched.actualMoneyUnit && props.errors.actualMoneyUnit)}
                                        fullWidth
                                        helperText={props.touched.actualMoneyUnit && props.errors.actualMoneyUnit}
                                        label="Выберите валюту"
                                        name="actualMoneyUnit"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.actualMoneyUnit}
                                        variant="outlined"
                                        required
                                        SelectProps={{
                                            MenuProps: {
                                                variant: "selectedMenu",
                                                anchorOrigin: {
                                                    vertical: "bottom",
                                                    horizontal: "left"
                                                },
                                                transformOrigin: {
                                                    vertical: "top",
                                                    horizontal: "left"
                                                },
                                                getContentAnchorEl: null
                                            }
                                        }}
                                    >
                                        {
                                            Object.keys(Currency).map((value, index) => (
                                                <MenuItem key={index} value={value}>{value}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                >
                                    <Autocomplete
                                        options={articles}
                                        getOptionLabel={option => option.name}
                                        getOptionSelected={(option, value) => option.name === value.name}
                                        onChange={(e, value) => {
                                            props.setFieldValue("articleId", value?.id);
                                        }}
                                        value={props.values.article}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.articleId && props.errors.articleId)}
                                                helperText={props.touched.articleId && props.errors.articleId}
                                                label="Выберите статьи"
                                                variant="outlined"
                                                onBlur={props.handleBlur}
                                                required
                                                {...params}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <TextField
                                        error={Boolean(props.touched.description && props.errors.description)}
                                        fullWidth
                                        helperText={props.touched.description && props.errors.description}
                                        label="Напишите коментарии"
                                        name="description"
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values.description}
                                        variant="outlined"
                                        multiline
                                        rows={2}
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
                                    {incomeArticle ? 'Сохранить' : 'Создать'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
}

export default CreateOrEditForm;
