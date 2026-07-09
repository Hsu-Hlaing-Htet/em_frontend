import api from '@/libs/axios';
import { endpoint } from '@/constants/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.maintenanceRequests, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.maintenanceRequests, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.maintenanceRequests}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.maintenanceRequests}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.maintenanceRequests}/${params.id}`);
        return result.data;
    },

    start: async (params) => {
        const result = await api.post(`${endpoint.maintenanceRequests}/${params.id}/start`);
        return result.data;
    },

    complete: async (params) => {
        const result = await api.post(`${endpoint.maintenanceRequests}/${params.id}/complete`);
        return result.data;
    },

    reject: async (params) => {
        const result = await api.post(`${endpoint.maintenanceRequests}/${params.id}/reject`);
        return result.data;
    },
};

export { service };
