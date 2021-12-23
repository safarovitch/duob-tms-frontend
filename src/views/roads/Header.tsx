import {Breadcrumbs, Grid, IconButton, Link, SvgIcon, Tooltip, Typography} from "@material-ui/core";
import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {NavLink as RouterLink} from "react-router-dom";
import {Download as DownloadIcon, Printer as PrinterIcon} from "react-feather";
import roadService from "../../services/RoadService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../utils/errorMessageHandler";
import * as fileSaver from "file-saver"
import CompleteRoadButton from "./CompleteRoadButton";
import {RoadStatusEnum} from "../../constants";
import ArrivedRoadButton from "./ArrivedRoadButton";

const Header: React.FC<{id: string, title: string, roadStatus: RoadStatusEnum, updateRoad: Function}> = ({id, title, roadStatus, updateRoad}) => {
    const {enqueueSnackbar} = useSnackbar()

    const handleInvoice = async () => {
        try {
            const invoice: any = await roadService.generateInvoice(Number(id))
            const fileBuffer: ArrayBuffer = await roadService.getInvoice(invoice.fileName) as ArrayBuffer
            const blob = new Blob([fileBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
            fileSaver.saveAs(blob, `Рейс №${id}.xlsx`)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    return (
        <Grid
            container
            justifyContent="space-between"
            alignItems="center"
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
                        to="/app/roads"
                        component={RouterLink}
                    >
                        Рейсы
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        Рейс № {id}
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    {title}
                </Typography>
            </Grid>
            <Grid item>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <ArrivedRoadButton status={roadStatus} roadId={Number(id)} updateRoad={updateRoad} />
                    </Grid>
                    <Grid item>
                        <CompleteRoadButton status={roadStatus} roadId={Number(id)} updateRoad={updateRoad} />
                    </Grid>
                    <Grid item>
                        <Tooltip title="Таможенная декларация">
                            <IconButton
                                color="secondary"
                                onClick={handleInvoice}
                            >
                                <SvgIcon fontSize="small">
                                    <DownloadIcon />
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Отчет по рейсу">
                            <IconButton
                                color="secondary"
                            >
                                <SvgIcon fontSize="small">
                                    <PrinterIcon />
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Header;
