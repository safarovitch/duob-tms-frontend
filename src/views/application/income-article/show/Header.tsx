import React, {useState} from "react";
import {Link as RouterLink} from "react-router-dom";
import {IncomeByArticleApplication} from "../../../../model/Application";
import {PDFViewer} from '@react-pdf/renderer';
import {Box, Breadcrumbs, Button, Dialog, Grid, Link, makeStyles, SvgIcon, Typography} from "@material-ui/core";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Printer as PrinterIcon} from "react-feather";
import IncomeArticlePDF from "./IncomeArticlePDF";

const useStyles = makeStyles((theme) => ({
    root: {},
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    },
    actionIcon: {
        marginRight: theme.spacing(1)
    }
}));

const Header: React.FC<{incomeArticle: IncomeByArticleApplication}> = ({incomeArticle}) => {
    const classes = useStyles();
    const [viewPDF, setViewPDF] = useState(false);

    return (
        <Grid
            container
            justifyContent="space-between"
            spacing={3}
        >
            <Grid item>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app"
                        component={RouterLink}
                    >
                        Главная
                    </Link>
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/application"
                        component={RouterLink}
                    >
                        Заявки
                    </Link>
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/application/income-article"
                        component={RouterLink}
                    >
                        Приход по статьям
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        {`Заявка № ${incomeArticle.id}`}
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    {`Заявка № ${incomeArticle.id}`}
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="outlined"
                    className={classes.action}
                    onClick={() => setViewPDF(true)}
                >
                    <SvgIcon
                        fontSize="small"
                        className={classes.actionIcon}
                    >
                        <PrinterIcon />
                    </SvgIcon>
                    Печать
                </Button>
                <Dialog fullScreen open={viewPDF}>
                    <Box
                        height="100%"
                        display="flex"
                        flexDirection="column"
                    >
                        <Box
                            bgcolor="common.white"
                            p={2}
                        >
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setViewPDF(false)}
                            >
                                <NavigateBeforeIcon />
                                Назад
                            </Button>
                        </Box>
                        <Box flexGrow={1}>
                            <PDFViewer
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                            >
                                <IncomeArticlePDF incomeArticle={incomeArticle} />
                            </PDFViewer>
                        </Box>
                    </Box>
                </Dialog>
            </Grid>
        </Grid>
    );
}

export default Header;
