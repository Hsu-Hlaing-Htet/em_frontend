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
        const result = await api.post(`${endpoint.invoices}/${params.id}/issue`, {
            late_fee_selection: params.late_fee_selection,
            due_date: params.due_date,
            items: params.items,
        });
        return result.data;
    },

    update: async (params) => {
        const { id, ...payload } = params;
        const result = await api.put(`${endpoint.invoices}/${id}`, payload);
        return result.data;
    },

    updateLateFeePolicy: async (params) => {
        const result = await api.put(`${endpoint.invoices}/${params.id}/late-fee-policy`, {
            late_fee_selection: params.late_fee_selection,
        });
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

    previewDocumentHtml: async (params) => {
        const response = await api.get(`${endpoint.invoices}/${params.id}/document/preview`, {
            responseType: 'text',
            headers: { Accept: 'text/html' },
            transformResponse: [(data) => data],
        });

        return typeof response.data === 'string' ? response.data : String(response.data ?? '');
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
