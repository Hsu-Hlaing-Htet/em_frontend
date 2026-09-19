import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';
import { downloadPdfResponse, PDF_DOWNLOAD_HEADERS } from '@/utils/downloadPdfResponse';

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

    delete: async (params) => {
        const result = await api.delete(`${endpoint.invoices}/${params.id}`, {
            data: {
                rejection_reason: params.rejection_reason,
            },
        });
        return result.data;
    },

    downloadDocument: async (params) => {
        const response = await api.get(`${endpoint.invoices}/${params.id}/document/download`, {
            responseType: 'blob',
            headers: PDF_DOWNLOAD_HEADERS,
        });

        return downloadPdfResponse(response, params.fallbackFilename || 'invoice.pdf');
    },

    sendDocumentEmail: async (params) => {
        const result = await api.post(`${endpoint.invoices}/${params.id}/document/email`, {
            email: params.email,
        });

        return result.data;
    },
};

export { service };
