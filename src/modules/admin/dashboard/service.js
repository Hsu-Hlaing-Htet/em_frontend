import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';
import { mockRepository } from './data/mockRepository';

/**
 * Toggle to false when Laravel dashboard endpoints are ready.
 * Each method mirrors a future REST resource under /api/dashboard/*.
 */
const USE_MOCK_DATA = true;

const dashboardService = {
    async fetchAll(options = {}) {
        if (USE_MOCK_DATA) {
            return mockRepository.getAll(options);
        }

        const result = await api.get(endpoint.dashboard);
        return result.data;
    },

    async fetchSection(sectionKey) {
        if (USE_MOCK_DATA) {
            return mockRepository.getSection(sectionKey);
        }

        const result = await api.get(`${endpoint.dashboard}/${sectionKey}`);
        return result.data;
    },

    async updateSettings(payload) {
        if (USE_MOCK_DATA) {
            await mockRepository.getSection('settings');
            return { settings: payload };
        }

        const result = await api.put(`${endpoint.dashboard}/settings`, payload);
        return result.data;
    },

    async generateReport(reportId) {
        if (USE_MOCK_DATA) {
            await mockRepository.getSection('reports');
            return { id: reportId, status: 'generating' };
        }

        const result = await api.post(`${endpoint.dashboard}/reports/${reportId}/generate`);
        return result.data;
    },
};

export { dashboardService, USE_MOCK_DATA };
