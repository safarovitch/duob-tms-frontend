import React from "react";
import {Box, Button, Card, CardContent, Grid, makeStyles, MenuItem, TextField} from "@material-ui/core";
import {RoadBalanceApplicationResponse, RoadDriverApplicationRequest} from "../../../model/Application";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import * as Yup from "yup";
import applicationService from "../../../services/Application";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {
    Currency,
    mapOfRoadDriverApplicationType,
    RoadDriverApplicationType
} from "../../../constants";
import {Formik, FormikProps} from "formik";
import {Autocomplete} from "@material-ui/lab";

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
    },
}));

const RoadDriverForm: React.FC<{ roads: RoadBalanceApplicationResponse[] }> = ({roads}) => {
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()

    const initialValues: RoadDriverApplicationRequest = {
        roadId: 0,
        type: '' as RoadDriverApplicationType,
        actualAmount: 0,
        actualMoneyUnit: '' as Currency,
        balanceTjs: 0,
        balanceUsd: 0,
        description: '',
    }

    const validationSchema = Yup.object().shape({
        actualAmount: Yup.number().typeError('Значение должно быть числом'),
        description: Yup.string().max(255)
    })

    const handleCreate = async (values: RoadDriverApplicationRequest, formActions: { [key: string]: any }) => {
        try {
            await applicationService.postRoadDriver(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            history.go(-1);
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const getRoadBalance = (roadId: number) => roads.find(item => item.id === roadId)

    const isDisabledAmount = ({actualMoneyUnit, balanceTjs, balanceUsd}: RoadDriverApplicationRequest) => {
        return (
            (actualMoneyUnit === Currency.TJS && balanceTjs === 0)
            ||
            (actualMoneyUnit === Currency.USD && balanceUsd === 0)
        )
    }

    const amountGreaterThenBalance = ({actualAmount, actualMoneyUnit, balanceTjs, balanceUsd}: RoadDriverApplicationRequest) => {
        return (
            (actualMoneyUnit === Currency.TJS && actualAmount > balanceTjs)
            ||
            (actualMoneyUnit === Currency.USD && actualAmount > balanceUsd)
        )
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                await handleCreate(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<RoadDriverApplicationRequest>) => (
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
                                >
                                    <Autocomplete
                                        options={roads}
                                        getOptionLabel={option => option.roadWithId}
                                        getOptionSelected={(option, value) => option.roadWithId === value.roadWithId}
                                        onChange={(e, value) => {
                                            props.setFieldValue("roadId", value?.id || 0)

                                            if (props.values.type === RoadDriverApplicationType.INCOME) {
                                                props.setFieldValue("balanceTjs", value?.incomeBalanceTjs || 0)
                                                props.setFieldValue("balanceUsd", value?.incomeBalanceUsd || 0)
                                            } else if (props.values.type === RoadDriverApplicationType.OUTCOME) {
                                                props.setFieldValue("balanceTjs", value?.outcomeBalanceTjs || 0)
                                                props.setFieldValue("balanceUsd", value?.outcomeBalanceUsd || 0)
                                            }
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                error={Boolean(props.touched.roadId && props.errors.roadId)}
                                                helperText={props.touched.roadId && props.errors.roadId}
                                                label="Выберите рейс"
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
                                    sm={6}
                                >
                                    <TextField
                                        fullWidth
                                        value={getRoadBalance(props.values.roadId)?.driverName || ''}
                                        disabled={true}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                >
                                    <TextField
                                        select
                                        error={Boolean(props.touched.type && props.errors.type)}
                                        fullWidth
                                        helperText={props.touched.type && props.errors.type}
                                        label="Выберите действие"
                                        name="type"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {
                                            const roadBalance = getRoadBalance(props.values.roadId)
                                            const type = e.target.value as RoadDriverApplicationType

                                            if (type === RoadDriverApplicationType.INCOME) {
                                                props.setFieldValue("balanceTjs", roadBalance?.incomeBalanceTjs || 0)
                                                props.setFieldValue("balanceUsd", roadBalance?.incomeBalanceUsd || 0)
                                            } else if (type === RoadDriverApplicationType.OUTCOME) {
                                                props.setFieldValue("balanceTjs", roadBalance?.outcomeBalanceTjs || 0)
                                                props.setFieldValue("balanceUsd", roadBalance?.outcomeBalanceUsd || 0)
                                            }

                                            props.handleChange(e)
                                        }}
                                        value={props.values.type}
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
                                            Object.keys(RoadDriverApplicationType).map((value, index) => (
                                                <MenuItem key={index} value={value}>{mapOfRoadDriverApplicationType.get(value)}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                >
                                    <TextField
                                        fullWidth
                                        value={`${props.values.balanceTjs} ${Currency.TJS}`}
                                        disabled={true}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                >
                                    <TextField
                                        fullWidth
                                        value={`${props.values.balanceUsd} ${Currency.USD}`}
                                        disabled={true}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        error={Boolean(props.touched.actualAmount && props.errors.actualAmount)}
                                        fullWidth
                                        helperText={props.touched.actualAmount && props.errors.actualAmount}
                                        label="Введите сумму"
                                        placeholder="0"
                                        name="actualAmount"
                                        onBlur={props.handleBlur}
                                        onChange={(e) => {

                                            props.handleChange(e)
                                        }}
                                        variant="outlined"
                                        disabled={isDisabledAmount(props.values)}
                                        required
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
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
                                            [Currency.TJS, Currency.USD].map((value, index) => (
                                                <MenuItem key={index} value={value}>{value}</MenuItem>
                                            ))
                                        }
                                    </TextField>
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
                                    disabled={props.isSubmitting || isDisabledAmount(props.values) || amountGreaterThenBalance(props.values)}
                                >
                                    Создать
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    )
}

export default RoadDriverForm