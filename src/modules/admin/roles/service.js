import api from '@/libs/axios';
import { endpoint } from '@/constants/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.roles, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.roles, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.roles}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.roles}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.roles}/${params.id}`);
        return result.data;
    },
};

export { service };
