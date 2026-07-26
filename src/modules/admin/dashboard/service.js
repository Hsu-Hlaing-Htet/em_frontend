import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';
import { mockRepository } from './data/mockRepository';

const CHART_PAYLOAD_KEYS = [
    'kpi_stats',
    'property_stats',
    'invoice_stats',
    'revenue_chart',
    'revenue_summary',
];

/**
 * List sections still use mock data until dedicated admin dashboard list APIs exist.
 * Chart metrics are loaded from the backend on every refresh.
 */
const dashboardService = {
    async fetchChartMetrics() {
        const result = await api.get(endpoint.adminDashboardCharts);
        return result.data;
    },

    async fetchAll(options = {}) {
        const mockPayload = await mockRepository.getAll(options);

        try {
            const chartPayload = await this.fetchChartMetrics();

            return {
                ...mockPayload,
                ...CHART_PAYLOAD_KEYS.reduce((merged, key) => {
                    if (chartPayload[key] !== undefined) {
                        merged[key] = chartPayload[key];
                    }

                    return merged;
                }, {}),
            };
        } catch (chartError) {
            console.warn('Dashboard chart API unavailable; falling back to mock chart data.', chartError);

            return mockPayload;
        }
    },

    async fetchSection(sectionKey) {
        if (CHART_PAYLOAD_KEYS.includes(sectionKey)) {
            const chartPayload = await this.fetchChartMetrics();
            return chartPayload[sectionKey];
        }

        return mockRepository.getSection(sectionKey);
    },

    async updateSettings(payload) {
        await mockRepository.getSection('settings');
        return { settings: payload };
    },

    async generateReport(reportId) {
        await mockRepository.getSection('reports');
        return { id: reportId, status: 'generating' };
    },
};

export { dashboardService };
