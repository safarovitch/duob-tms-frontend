import React, {useEffect, useState} from "react";
import {Box, Container, makeStyles} from "@material-ui/core";
import Page from "../../../components/Page";
import Header from "./Header";
import CreateOrEditForm from "./CreateOrEditForm";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import LoadingLayout from "../../../components/LoadingLayout";
import {Article} from "../../../model/Article";
import {Employee} from "../../../model/Employee";
import articleService from "../../../services/ArticleService";
import {ARTICLES} from "../../../constants";
import employeeService from "../../../services/EmployeeService";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

function RoadTrailerView() {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [articles, setArticles] = useState<Article[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const fetchArticles: any = await articleService.getArticles(ARTICLES.OUTCOME)
                const fetchEmployees: any = await employeeService.getEmployees()

                setArticles(fetchArticles)
                setEmployees(fetchEmployees)
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <Page title={'Расход по статьям'}>
            {articles.length > 0
                ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header/>
                        <Box mt={3}>
                            <CreateOrEditForm articles={articles} employees={employees} />
                        </Box>
                    </Container>
                )
                : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default RoadTrailerView;
