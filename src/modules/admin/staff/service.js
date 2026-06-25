import api from '@/libs/axios';
import { endpoint } from '@/constants/endpoint';

const service = {
    getAll: async ({ page, per_page, search, order }) => {
        try {
            const result = await api.get(endpoint.staff, {
                params: { page, per_page, search, order },
            });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.staff, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.staff}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.staff}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.staff}/${params.id}`);
        return result.data;
    },
};

export { service };
