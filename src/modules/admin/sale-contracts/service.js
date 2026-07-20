import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.saleContractDrafts, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.saleContractDrafts, params);
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.saleContractDrafts}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.saleContractDrafts}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.saleContractDrafts}/${params.id}`);
        return result.data;
    },
};

const saleService = {
    getDrafts: async (params) => {
        const result = await api.get(endpoint.saleContractDrafts, { params });
        return result.data;
    },

    getApproved: async (params) => {
        const result = await api.get(endpoint.saleContractsApproved, { params });
        return result.data;
    },

    getDraft: async (params) => {
        const result = await api.get(`${endpoint.saleContractDrafts}/${params.id}`);
        return result.data;
    },

    getApprovedOne: async (params) => {
        const result = await api.get(`${endpoint.saleContractsApproved}/${params.id}`);
        return result.data;
    },

    approve: async (params) => {
        const result = await api.post(`${endpoint.saleContractDrafts}/${params.id}/approve`);
        return result.data;
    },

    reject: async (params) => {
        const result = await api.post(`${endpoint.saleContractDrafts}/${params.id}/reject`, {
            rejection_reason: params.rejection_reason,
        });
        return result.data;
    },

    fetchDocument: async (scope, id, action) => {
        const base = scope === 'approved'
            ? `${endpoint.saleContractsApproved}/${id}/document`
            : `${endpoint.saleContractDrafts}/${id}/document`;
        const requestConfig = {
            responseType: 'blob',
            headers: {
                Accept: 'text/html, application/xhtml+xml, */*',
            },
        };

        if (action === 'download') {
            return api.get(`${base}/download`, requestConfig);
        }

        if (action === 'export') {
            return api.get(`${base}/export`, requestConfig);
        }

        throw new Error(`Unsupported document action: ${action}`);
    },

    sendDocumentEmail: async (scope, id, payload = {}) => {
        const base = scope === 'approved'
            ? `${endpoint.saleContractsApproved}/${id}/document/email`
            : `${endpoint.saleContractDrafts}/${id}/document/email`;
        const result = await api.post(base, payload);

        return result.data;
    },
};

export { service, saleService };
