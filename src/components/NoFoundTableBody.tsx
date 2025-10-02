import React from "react";
import {CircularProgress, makeStyles, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    noRecordsFound: {
        height: '250px',
    },
}));

const NoFoundTableBody: React.FC<{loading: boolean}> = ({loading}) => {
    const classes = useStyles();

    return (
        <TableBody>
            <TableRow>
                <TableCell className={classes.noRecordsFound} colSpan={50} align="center">
                    {
                        loading
                            ? <CircularProgress size={48}/>
                            : <Typography display="block">Не найдено ни одной записи</Typography>
                    }
                </TableCell>
            </TableRow>
        </TableBody>
    )
}

export default NoFoundTableBody
