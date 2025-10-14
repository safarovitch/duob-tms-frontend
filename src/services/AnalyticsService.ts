import api from '../utils/Api';

const API_BASE_URL = '/duobtms';

export interface DashboardStatistics {
    metrics: {
        totalShipments: number;
        activeCargo: number;
        totalRevenue: number;
        activeCustomers: number;
        shipmentsChange: number;
        cargoChange: number;
        revenueChange: number;
        customersChange: number;
    };
    monthlyData: Array<{
        month: string;
        shipments: number;
        revenue: number;
    }>;
    topRoutes: Array<{
        route: string;
        shipments: number;
        revenue: number;
    }>;
    cargoStatus: Array<{
        status: string;
        count: number;
        percentage: number;
    }>;
}

export const AnalyticsService = {
    async getDashboardStatistics(startDate?: string, endDate?: string): Promise<DashboardStatistics> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const response = await api.get(`${API_BASE_URL}/analytics/dashboard?${params.toString()}`);
        return response.data;
    }
};
