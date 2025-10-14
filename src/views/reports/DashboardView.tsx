import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    LinearProgress,
    makeStyles,
    useTheme,
    TextField,
    Button,
    CircularProgress
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
    TrendingUp,
    TrendingDown,
    LocalShipping,
    Storage,
    AttachMoney,
    People,
    Assessment,
    Refresh
} from '@material-ui/icons';
import { DatePicker } from '@material-ui/pickers';
import Page from '../../components/Page';
import { AnalyticsService, DashboardStatistics } from '../../services/AnalyticsService';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3)
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    cardContent: {
        flexGrow: 1
    },
    metricCard: {
        textAlign: 'center',
        padding: theme.spacing(2)
    },
    metricValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: theme.spacing(1)
    },
    metricLabel: {
        color: theme.palette.text.secondary
    },
    chartContainer: {
        height: 300,
        padding: theme.spacing(2)
    },
    tableContainer: {
        marginTop: theme.spacing(2)
    },
    positiveChange: {
        color: theme.palette.success.main
    },
    negativeChange: {
        color: theme.palette.error.main
    },
    progressBar: {
        marginTop: theme.spacing(1)
    }
}));

// Mock data for demonstration
const mockData = {
    metrics: {
        totalShipments: 0,
        activeCargo: 0,
        totalRevenue: 0,
        activeCustomers: 0,
        shipmentsChange: 0,
        cargoChange: 0,
        revenueChange: 0,
        customersChange: 0
    },
    monthlyData: [
        { month: 'Янв', shipments: 0, revenue: 0 },
        { month: 'Фев', shipments: 0, revenue: 0 },
        { month: 'Мар', shipments: 0, revenue: 0 },
        { month: 'Апр', shipments: 0, revenue: 0 },
        { month: 'Май', shipments: 0, revenue: 0 },
        { month: 'Июн', shipments: 0, revenue: 0 },
        { month: 'Июл', shipments: 0, revenue: 0 },
        { month: 'Авг', shipments: 0, revenue: 0 },
        { month: 'Сен', shipments: 0, revenue: 0 },
        { month: 'Окт', shipments: 0, revenue: 0 },
        { month: 'Ноя', shipments: 0, revenue: 0 },
        { month: 'Дек', shipments: 0, revenue: 0 }
    ],
    topRoutes: [
        { route: 'Нет данных', shipments: 0, revenue: 0 },
        { route: 'Нет данных', shipments: 0, revenue: 0 },
        { route: 'Нет данных', shipments: 0, revenue: 0 },
        { route: 'Нет данных', shipments: 0, revenue: 0 },
        { route: 'Нет данных', shipments: 0, revenue: 0 }
    ],
    cargoStatus: [
        { status: 'Нет данных', count: 0, percentage: 0 },
        { status: 'Нет данных', count: 0, percentage: 0 },
        { status: 'Нет данных', count: 0, percentage: 0 },
        { status: 'Нет данных', count: 0, percentage: 0 }
    ]
};

const SimpleChart = ({ data, type = 'line' }: { data: any[], type?: string }) => {
    const theme = useTheme();
    const maxValue = Math.max(...data.map(d => d.shipments || d.revenue));
    
    if (type === 'bar') {
        return (
            <Box display="flex" alignItems="end" height="200px" gap={1}>
                {data.map((item, index) => (
                    <Box key={index} display="flex" flexDirection="column" alignItems="center" flex={1}>
                        <Box
                            width="100%"
                            height={`${((item.shipments || item.revenue) / maxValue) * 150}px`}
                            bgcolor={theme.palette.primary.main}
                            borderRadius="4px 4px 0 0"
                            marginBottom={1}
                        />
                        <Typography variant="caption" color="textSecondary">
                            {item.month}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    }
    
    return (
        <Box display="flex" alignItems="end" height="200px" gap={1}>
            {data.map((item, index) => (
                <Box key={index} display="flex" flexDirection="column" alignItems="center" flex={1}>
                    <Box
                        width="100%"
                        height={`${((item.shipments || item.revenue) / maxValue) * 150}px`}
                        bgcolor={theme.palette.secondary.main}
                        borderRadius="4px"
                        marginBottom={1}
                    />
                    <Typography variant="caption" color="textSecondary">
                        {item.month}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

const MetricCard = ({ title, value, change, icon, color = 'primary' }: any) => {
    const classes = useStyles();
    const isPositive = change > 0;
    
    return (
        <Card className={classes.card}>
            <CardContent className={classes.metricCard}>
                <Box display="flex" justifyContent="center" alignItems="center" marginBottom={2}>
                    {React.cloneElement(icon, { style: { fontSize: 40, color: color === 'primary' ? '#1976d2' : '#388e3c' } })}
                </Box>
                <Typography className={classes.metricValue} color={color}>
                    {typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}
                </Typography>
                <Typography className={classes.metricLabel} variant="body2">
                    {title}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" marginTop={1}>
                    {isPositive ? <TrendingUp className={classes.positiveChange} /> : <TrendingDown className={classes.negativeChange} />}
                    <Typography 
                        variant="body2" 
                        className={isPositive ? classes.positiveChange : classes.negativeChange}
                        style={{ marginLeft: 4 }}
                    >
                        {Math.abs(change)}%
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

const DashboardView = () => {
    const classes = useStyles();
    const [data, setData] = useState<DashboardStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 12);
        return date;
    });
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const startDateStr = startDate ? startDate.toISOString().split('T')[0] : undefined;
            const endDateStr = endDate ? endDate.toISOString().split('T')[0] : undefined;
            
            const result = await AnalyticsService.getDashboardStatistics(startDateStr, endDateStr);
            setData(result);
        } catch (err) {
            console.error('Error fetching analytics data:', err);
            setError('Ошибка загрузки данных. Показаны тестовые данные.');
            setData(mockData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        fetchData();
    };

    if (loading && !data) {
        return (
            <Page className={classes.root} title="Аналитическая панель">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Page>
        );
    }

    if (!data) {
        return (
            <Page className={classes.root} title="Аналитическая панель">
                <Alert severity="error">
                    Не удалось загрузить данные аналитики.
                </Alert>
            </Page>
        );
    }

    return (
        <Page className={classes.root} title="Аналитическая панель">
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                <Typography variant="h4">
                    Аналитическая панель
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    Обновить
                </Button>
            </Box>

            {error && (
                <Alert severity="warning" style={{ marginBottom: 16 }}>
                    {error}
                </Alert>
            )}

            {/* Date Filters */}
            <Card style={{ marginBottom: 24 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Фильтры по дате
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                label="Начальная дата"
                                value={startDate}
                                onChange={setStartDate}
                                format="dd/MM/yyyy"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                label="Конечная дата"
                                value={endDate}
                                onChange={setEndDate}
                                format="dd/MM/yyyy"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleRefresh}
                                disabled={loading}
                                fullWidth
                            >
                                Применить фильтр
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            
            {/* Key Metrics */}
            <Grid container spacing={3} style={{ marginBottom: 24 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Всего перевозок"
                        value={data.metrics.totalShipments}
                        change={data.metrics.shipmentsChange}
                        icon={<LocalShipping />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Активный груз"
                        value={data.metrics.activeCargo}
                        change={data.metrics.cargoChange}
                        icon={<Storage />}
                        color="secondary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Общий доход"
                        value={`$${data.metrics.totalRevenue.toLocaleString()}`}
                        change={data.metrics.revenueChange}
                        icon={<AttachMoney />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Активные клиенты"
                        value={data.metrics.activeCustomers}
                        change={data.metrics.customersChange}
                        icon={<People />}
                        color="secondary"
                    />
                </Grid>
            </Grid>

            {/* Charts and Tables */}
            <Grid container spacing={3}>
                {/* Monthly Shipments Chart */}
                <Grid item xs={12} md={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ежемесячные перевозки
                            </Typography>
                            <Box className={classes.chartContainer}>
                                <SimpleChart data={data.monthlyData} type="line" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Monthly Revenue Chart */}
                <Grid item xs={12} md={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ежемесячный доход
                            </Typography>
                            <Box className={classes.chartContainer}>
                                <SimpleChart data={data.monthlyData} type="line" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Routes Table */}
                <Grid item xs={12} md={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Популярные маршруты
                            </Typography>
                            <TableContainer component={Paper} className={classes.tableContainer}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Маршрут</TableCell>
                                            <TableCell align="right">Перевозки</TableCell>
                                            <TableCell align="right">Доход</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.topRoutes.map((route, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{route.route}</TableCell>
                                                <TableCell align="right">{route.shipments}</TableCell>
                                                <TableCell align="right">${route.revenue.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Cargo Status */}
                <Grid item xs={12} md={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Распределение статусов груза
                            </Typography>
                            <Box className={classes.tableContainer}>
                                {data.cargoStatus.map((status, index) => (
                                    <Box key={index} marginBottom={2}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
                                            <Typography variant="body2">{status.status}</Typography>
                                            <Box display="flex" alignItems="center">
                                                <Typography variant="body2" style={{ marginRight: 8 }}>
                                                    {status.count}
                                                </Typography>
                                                <Chip 
                                                    label={`${status.percentage}%`} 
                                                    size="small" 
                                                    color="primary" 
                                                />
                                            </Box>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={status.percentage} 
                                            className={classes.progressBar}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Page>
    );
};

export default DashboardView;
