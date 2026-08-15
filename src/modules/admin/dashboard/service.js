import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

function paginatedPayload(response) {
    const payload = response?.data?.data;

    return {
        items: Array.isArray(payload?.data) ? payload.data : [],
        total: Number(payload?.total) || 0,
    };
}

function countExpiredContracts(contracts) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return contracts.filter((contract) => {
        if (!contract?.end_date) {
            return false;
        }

        const endDate = new Date(`${contract.end_date}T00:00:00`);
        return !Number.isNaN(endDate.getTime()) && endDate < today;
    }).length;
}

const dashboardService = {
    async fetchChartMetrics() {
        const result = await api.get(endpoint.adminDashboardCharts);
        return result.data;
    },

    async fetchAll() {
        const [chartPayload, pendingMaintenanceResponse, activeMaintenanceResponse, activeRentResponse] = await Promise.all([
            this.fetchChartMetrics(),
            api.get(endpoint.maintenanceRequests, {
                params: { status: 'pending', per_page: 1 },
            }),
            api.get(endpoint.maintenanceRequests, {
                params: { status: 'in_progress', per_page: 1 },
            }),
            api.get(endpoint.rentContractsActive, {
                params: { per_page: 1000 },
            }),
        ]);

        const pendingMaintenance = paginatedPayload(pendingMaintenanceResponse);
        const activeMaintenance = paginatedPayload(activeMaintenanceResponse);
        const activeRentContracts = paginatedPayload(activeRentResponse);

        return {
            ...chartPayload,
            activity_timeline: [],
            system_alerts: {
                expired_contracts: countExpiredContracts(activeRentContracts.items),
                unresolved_maintenance: pendingMaintenance.total + activeMaintenance.total,
            },
        };
    },

    async updateSettings() {
        throw new Error('Dashboard settings are unavailable because no backend endpoint exists.');
    },

    async generateReport() {
        throw new Error('Dashboard report generation is unavailable because no backend endpoint exists.');
    },
};

export { dashboardService };
