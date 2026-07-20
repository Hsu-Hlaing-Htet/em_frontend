import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

const service = {
    getCurrentUser: async () => {
        const result = await api.get(endpoint.me);
        return result.data;
    },

    getStaffProfile: async (id) => {
        const result = await api.get(`${endpoint.staff}/${id}`);
        return result.data;
    },

    updateProfile: async (params) => {
        const result = await api.put(`${endpoint.staff}/${params.id}`, params);
        return result.data;
    },
};

export { service };
