import api from '@/libs/axios';
import { endpoint } from '@/constants/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.users, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.users, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.users}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.users}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        try {
            const result = await api.delete(`${endpoint.users}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },
};

export { service };
