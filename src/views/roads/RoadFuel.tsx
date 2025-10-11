import React from "react";
import {Road} from "../../model/Road";
import {Box, Button, Card, CardContent, Grid, makeStyles, TextField} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    buttons: {
        marginBottom: theme.spacing(1),
        float: 'right'
    }
}));

const RoadFuel: React.FC<{road: Road}> = ({road}) => {
    const classes = useStyles();
    const history = useHistory()

    if (road.privateTruck) {
        history.go(-1);
        return null;
    }

    return (
        <form>
            <Card className={classes.root}>
                <CardContent>
                    <Grid
                        container
                        spacing={4}
                    >
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Остаток в баке до отправки(л)"
                                value={road.fuelBalanceBeforeDeparture}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Заправка на базе (л)"
                                value={road.refuelingOnBase}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Заправка в пути (л)"
                                value={road.refuelingOnWay}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Общая заправка (л)"
                                value={road.totalRefueling}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Расход отправки без груза"
                                value={road.fuelOutcomeDepartureWithoutCargo}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Расход отправки с грузом"
                                value={road.fuelOutcomeDepartureWithCargo}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Расход отправки прицепа (кг)"
                                value={road.fuelOutcomeDepartureWithTrailer}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Общий расход отправки"
                                value={road.totalFuelOutcomeDeparture}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Расход возврата с без груза"
                                value={road.fuelOutcomeArrivalWithoutCargo}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Расход возврата с грузом"
                                value={road.fuelOutcomeArrivalWithCargo}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Расход прицепа с грузом"
                                value={road.fuelOutcomeArrivalWithCargoAndTrailer}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Общий расход возврата"
                                value={road.totalFuelOutcomeArrival}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Общий расход"
                                value={road.totalFuelOutcome}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Дополнительный расход (л)"
                                value={road.additionalFuelOutcome}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                        >
                            <TextField
                                fullWidth
                                label="Остаток в баке после прибытье"
                                value={road.tankBalanceAfterArrival}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Box mt={2} pb={1} className={classes.buttons}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            type="button"
                            to="/app/roads"
                            component={RouterLink}
                        >
                            Отмена
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    )
}

export default RoadFuel
