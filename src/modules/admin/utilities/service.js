import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';
import { downloadPdfResponse, PDF_DOWNLOAD_HEADERS } from '@/utils/downloadPdfResponse';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.utilities, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    add: async (params) => {
        const result = await api.post(endpoint.utilities, params);
        return result.data;
    },

    addBatch: async (params) => {
        const result = await api.post(`${endpoint.utilities}/batch`, params);
        return result.data;
    },

    previewBulkImport: async (params) => {
        const result = await api.post(`${endpoint.utilities}/bulk-import/preview`, params);
        return result.data;
    },

    confirmBulkImport: async (params) => {
        const result = await api.post(`${endpoint.utilities}/bulk-import/confirm`, params);
        return result.data;
    },

    getFormData: async (params) => {
        const result = await api.get(`${endpoint.utilities}/form-data`, { params });
        return result.data;
    },

    getActiveRate: async (params) => {
        const result = await api.get(`${endpoint.utilities}/active-rate`, { params });
        return result.data;
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.utilities}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    update: async (params) => {
        const result = await api.put(`${endpoint.utilities}/${params.id}`, params);
        return result.data;
    },

    delete: async (params) => {
        const result = await api.delete(`${endpoint.utilities}/${params.id}`);
        return result.data;
    },

    submit: async (params) => {
        const result = await api.post(`${endpoint.utilities}/${params.id}/submit`);
        return result.data;
    },

    approve: async (params) => {
        const result = await api.post(`${endpoint.utilities}/${params.id}/approve`);
        return result.data;
    },

    reject: async (params) => {
        const result = await api.post(`${endpoint.utilities}/${params.id}/reject`);
        return result.data;
    },

    downloadDocument: async (params) => {
        const response = await api.get(`${endpoint.utilities}/${params.id}/document/download`, {
            responseType: 'blob',
            headers: PDF_DOWNLOAD_HEADERS,
        });

        return downloadPdfResponse(response, params.fallbackFilename || 'utility-bill.pdf');
    },

    sendDocumentEmail: async (params) => {
        const result = await api.post(`${endpoint.utilities}/${params.id}/document/email`, {
            email: params.email,
        });

        return result.data;
    },
};

export { service };
