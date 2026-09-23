import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

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

    accept: async (params) => {
        // Backend Accept = start (pending → in_progress). Alias route also exists.
        const result = await api.post(`${endpoint.maintenanceRequests}/${params.id}/accept`);
        return result.data;
    },

    start: async (params) => {
        const result = await api.post(`${endpoint.maintenanceRequests}/${params.id}/start`);
        return result.data;
    },

    assign: async (params) => {
        // Assignment fields are not persisted by the current backend workflow.
        // Keep the call shape for UI compatibility; surface a clear 422 via local guard.
        throw {
            status: 422,
            data: {
                message: 'Staff assignment is not available in the current maintenance workflow. Use Complete when work is done.',
            },
        };
    },

    complete: async (params) => {
        const result = await api.post(`${endpoint.maintenanceRequests}/${params.id}/complete`, {
            resolution_note: params.resolution_note,
            maintenance_fee_amount: params.maintenance_fee_amount,
            charge_description: params.charge_description,
        });
        return result.data;
    },

    reject: async (params) => {
        const result = await api.post(`${endpoint.maintenanceRequests}/${params.id}/reject`, {
            rejection_reason: params.rejection_reason,
        });
        return result.data;
    },

    cancel: async (params) => {
        const result = await api.post(`${endpoint.maintenanceRequests}/${params.id}/cancel`, {
            cancellation_reason: params.cancellation_reason,
        });
        return result.data;
    },
};

export { service };
