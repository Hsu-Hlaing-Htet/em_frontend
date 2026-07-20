import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.invoices, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.invoices, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.invoices}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    generateFromContract: async (params) => {
        const result = await api.post(`${endpoint.invoices}/generate-from-contract/${params.contract_id}`);
        return result.data;
    },

    issue: async (params) => {
        const result = await api.post(`${endpoint.invoices}/${params.id}/issue`);
        return result.data;
    },

    sendDocumentEmail: async (params) => {
        const result = await api.post(`${endpoint.invoices}/${params.id}/document/email`, {
            email: params.email,
        });

        return result.data;
    },
};

export { service };
