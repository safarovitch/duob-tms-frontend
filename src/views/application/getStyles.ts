import {makeStyles} from "@material-ui/core";

const getStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    queryField: {
        width: 350
    },
    approved: {
        color: 'green',
        fontWeight: 600
    },
    statusPaid: {
        color: 'green',
        fontWeight: 600
    },
    statusWaiting: {
        color: 'red',
        fontWeight: 600
    },
    totalBalance: {
        paddingLeft: theme.spacing(3),
        paddingTop: theme.spacing(2),
    },
}));

export default getStyles