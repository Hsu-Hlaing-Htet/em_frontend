import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.paymentPlans, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.paymentPlans, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.paymentPlans}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.paymentPlans}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.paymentPlans}/${params.id}`);
        return result.data;
    },
};

export { service };
