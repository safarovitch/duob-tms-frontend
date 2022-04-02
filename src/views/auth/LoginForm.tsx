import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik, FormikProps} from 'formik';
import {
    Box,
    Button,
    TextField,
    makeStyles, CircularProgress
} from '@material-ui/core';
import {login} from "../../store/actions/accountActions";

const useStyles = makeStyles(() => ({
    root: {},
    buttonProgressBox: {position: 'relative'},
    buttonProgress: {
        color: "secondary",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));

export type LoginFormProps = {
    className?: string;
    onSubmitFailure: (message: string) => void
}

interface LoginFormValues {
    username: string;
    password: string;
    message?: string;
}

const loginValidationSchema = Yup.object().shape({
    username: Yup.string().max(255).required('Имя пользователя обязательное поле!'),
    password: Yup.string().max(255).required('Введите пароль')
});

const LoginForm: React.FC<LoginFormProps> = ({ className, onSubmitFailure, ...rest }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <Formik
            initialValues={{
                username: '',
                password: ''
            }}
            validationSchema={loginValidationSchema}
            onSubmit={async (values, {
                setStatus,
                setSubmitting
            }) => {
                try {
                    await dispatch(login(values.username, values.password));
                    window.location.reload()
                } catch (error: any) {
                    let message: string;

                    switch (error.response.status) {
                        case 400: message = 'Что-то пошло не так. Попробуйте снова.'; break;
                        case 403: message = 'Имя пользователя или пароль недействительны. Попробуйте еще раз!'; break;
                        default : message = error.message;
                    }
                    setStatus({ success: false });
                    onSubmitFailure(message)
                    setSubmitting(false);
                }
            }}
        >
            {(props: FormikProps<LoginFormValues>) => (
                <form
                    noValidate
                    className={clsx(classes.root, className)}
                    onSubmit={props.handleSubmit}
                    {...rest}
                >
                    <TextField
                        error={Boolean(props.touched.username && props.errors.username)}
                        fullWidth
                        helperText={props.touched.username && props.errors.username}
                        label="Имя Пользователя"
                        margin="normal"
                        name="username"
                        autoComplete="on"
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        type="text"
                        value={props.values.username}
                        variant="outlined"
                    />
                    <TextField
                        error={Boolean(props.touched.password && props.errors.password)}
                        fullWidth
                        helperText={props.touched.password && props.errors.password}
                        label="Пароль"
                        margin="normal"
                        name="password"
                        autoComplete="on"
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        type="password"
                        value={props.values.password}
                        variant="outlined"

                    />
                    <Box mt={2} className={classes.buttonProgressBox}>
                        <Button
                            color="secondary"
                            disabled={props.isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            Войти
                        </Button>
                        {props.isSubmitting && (<CircularProgress size={24} className={classes.buttonProgress} />)}
                    </Box>
                </form>
            )}
        </Formik>
    );
}

export default LoginForm;
