import api from '@/libs/axios';
import { endpoint } from '@/constants/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.contracts, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.contracts, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.contracts}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.contracts}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.contracts}/${params.id}`);
        return result.data;
    },

    submit: async (params) => {
        const result = await api.post(`${endpoint.contracts}/${params.id}/submit`);
        return result.data;
    },

    approve: async (params) => {
        const result = await api.post(`${endpoint.contracts}/${params.id}/approve`);
        return result.data;
    },

    reject: async (params) => {
        const result = await api.post(`${endpoint.contracts}/${params.id}/reject`);
        return result.data;
    },
};

export { service };
