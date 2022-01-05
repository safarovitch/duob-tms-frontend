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
import {useHistory} from "react-router-dom";
import {WarehouseSecondaryMoneyUnit} from "../../../model/Application";
import applicationService from "../../../services/Application";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const Index: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [articles, setArticles] = useState<Article[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [warehouseSecondaryMoneyUnit, setWarehouseSecondaryMoneyUnit] = useState<WarehouseSecondaryMoneyUnit>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                const dataArticles: any = await articleService.getArticles(ARTICLES.OUTCOME)
                const dataEmployees: any = await employeeService.getEmployees()
                const dataWarehouseSecondaryMoneyUnit: any = await applicationService.getWarehouseSecondaryMoneyUnit()

                if (dataArticles.length === 0 || dataEmployees.length === 0 || !dataWarehouseSecondaryMoneyUnit) {
                    history.go(-1)
                    enqueueSnackbar('Добавьте с начала статью, сотрудника и курс валюты', {variant: 'info'})
                } else if (!cancel) {
                    setArticles(dataArticles)
                    setEmployees(dataEmployees)
                    setWarehouseSecondaryMoneyUnit(dataWarehouseSecondaryMoneyUnit)
                }
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [history, enqueueSnackbar])

    return (
        <Page title={'Расход по статьям'}>
            {
                articles.length > 0 && employees.length > 0 && warehouseSecondaryMoneyUnit ? (
                    <Container className={classes.root} maxWidth="md">
                        <Header/>
                        <Box mt={3}>
                            <CreateOrEditForm
                                articles={articles}
                                employees={employees}
                                warehouseSecondaryMoneyUnit={warehouseSecondaryMoneyUnit}
                            />
                        </Box>
                    </Container>
                ) : <LoadingLayout loading={loading} hasError={hasError} />
            }
        </Page>
    );
}

export default Index;
