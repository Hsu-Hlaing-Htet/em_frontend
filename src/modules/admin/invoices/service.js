import api from '@/libs/axios';
import { endpoint } from '@/constants/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.invoices, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.invoices}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    issue: async (params) => {
        const result = await api.post(`${endpoint.invoices}/${params.id}/issue`);
        return result.data;
    },
};

export { service };
