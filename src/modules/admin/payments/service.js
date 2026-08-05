import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.payments, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.payments, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.payments}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.payments}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.payments}/${params.id}`);
        return result.data;
    },

    approve: async (params) => {
        const result = await api.post(`${endpoint.payments}/${params.id}/approve`, {
            amount: params.amount,
        });
        return result.data;
    },

    reject: async (params) => {
        const result = await api.post(`${endpoint.payments}/${params.id}/reject`, {
            rejection_reason: params.rejection_reason,
        });
        return result.data;
    },

    uploadProof: async (params) => {
        const formData = new FormData();
        formData.append('proof', params.file);
        const result = await api.post(`${endpoint.payments}/${params.id}/proof`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return result.data;
    },
};

export { service };
