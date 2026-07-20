import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.utilityRates, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.utilityRates, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.utilityRates}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.utilityRates}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.utilityRates}/${params.id}`);
        return result.data;
    },
};

export { service };
