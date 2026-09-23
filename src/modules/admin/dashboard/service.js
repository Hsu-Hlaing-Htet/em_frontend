import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

const dashboardService = {
    async fetchChartMetrics() {
        const result = await api.get(endpoint.adminDashboardCharts);
        return result.data;
    },

    async fetchAll() {
        const chartPayload = await this.fetchChartMetrics();

        return {
            ...chartPayload,
            // No dedicated audit/activity feed exists — keep empty (real empty state).
            activity_timeline: Array.isArray(chartPayload.activity_timeline)
                ? chartPayload.activity_timeline
                : [],
            system_alerts: chartPayload.system_alerts ?? {
                expired_contracts: 0,
                unresolved_maintenance: 0,
                overdue_invoices: 0,
                items: [],
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
