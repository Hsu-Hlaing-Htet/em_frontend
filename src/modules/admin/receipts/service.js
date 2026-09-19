import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';
import { downloadPdfResponse, PDF_DOWNLOAD_HEADERS } from '@/utils/downloadPdfResponse';

const service = {
    getAll: async (params) => {
        try {
            const result = await api.get(endpoint.receipts, { params });
            return result.data;
        } catch {
            return null;
        }
    },

    getOne: async (params) => {
        try {
            const result = await api.get(`${endpoint.receipts}/${params.id}`);
            return result.data;
        } catch {
            return null;
        }
    },

    approve: async (params) => {
        const result = await api.post(`${endpoint.receipts}/${params.id}/approve`);
        return result.data;
    },

    reject: async (params) => {
        const result = await api.post(`${endpoint.receipts}/${params.id}/reject`, {
            rejection_reason: params.rejection_reason,
        });
        return result.data;
    },

    issue: async (params) => {
        const result = await api.post(`${endpoint.receipts}/${params.id}/issue`);
        return result.data;
    },

    downloadDocument: async (params) => {
        const response = await api.get(`${endpoint.receipts}/${params.id}/document/download`, {
            responseType: 'blob',
            headers: PDF_DOWNLOAD_HEADERS,
        });

        return downloadPdfResponse(response, params.fallbackFilename || 'receipt.pdf');
    },

    sendDocumentEmail: async (params) => {
        const result = await api.post(`${endpoint.receipts}/${params.id}/document/email`, {
            email: params.email,
        });

        return result.data;
    },
};

export { service };
