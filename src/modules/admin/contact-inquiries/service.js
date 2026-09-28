import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.contactInquiries, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.contactInquiries}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },
};

export { service };
