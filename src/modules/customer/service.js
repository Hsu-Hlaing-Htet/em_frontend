import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';
import { downloadBlob } from '@/utils/downloadFile';

const service = {
    getDashboard: async () => {
        const result = await api.get(endpoint.customerDashboard);
        return result.data;
    },

    getProfile: async () => {
        const result = await api.get(endpoint.customerProfile);
        return result.data;
    },

    updateProfile: async (params) => {
        const result = await api.put(endpoint.customerProfile, params);
        return result.data;
    },

    getContracts: async (params) => {
        const result = await api.get(endpoint.customerContracts, { params });
        return result.data;
    },

    getContract: async (params) => {
        const result = await api.get(`${endpoint.customerContracts}/${params.id}`);
        return result.data;
    },

    downloadContractDocument: async (id) => {
        const result = await api.get(`${endpoint.customerContracts}/${id}/document/download`, {
            responseType: 'blob',
            headers: { Accept: 'text/html, application/xhtml+xml, */*' },
        });
        return result.data;
    },

    getInvoices: async (params) => {
        const result = await api.get(endpoint.customerInvoices, { params });
        return result.data;
    },

    getInvoice: async (params) => {
        const result = await api.get(`${endpoint.customerInvoices}/${params.id}`);
        return result.data;
    },

    downloadInvoiceDocument: async (id, filename) => {
        const blob = await service.downloadInvoiceBlob(id);
        downloadBlob(filename, blob);
    },

    downloadInvoiceBlob: async (id) => {
        const result = await api.get(`${endpoint.customerInvoices}/${id}/document/download`, {
            responseType: 'blob',
            headers: { Accept: 'text/html, application/xhtml+xml, */*' },
        });
        return result.data;
    },

    getPayments: async (params) => {
        const result = await api.get(endpoint.customerPayments, { params });
        return result.data;
    },

    submitPayment: async (params) => {
        const formData = new FormData();
        formData.append('invoice_id', params.invoice_id);
        formData.append('payment_method_id', params.payment_method_id);
        formData.append('amount', params.amount);
        formData.append('payment_date', params.payment_date);

        if (params.note) {
            formData.append('note', params.note);
        }

        if (params.proof) {
            formData.append('proof', params.proof);
        }

        const result = await api.post(endpoint.customerPayments, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return result.data;
    },

    uploadPaymentProof: async (params) => {
        const formData = new FormData();
        formData.append('proof', params.file);
        const result = await api.post(`${endpoint.customerPayments}/${params.id}/proof`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return result.data;
    },

    getReceipts: async (params) => {
        const result = await api.get(endpoint.customerReceipts, { params });
        return result.data;
    },

    getReceipt: async (params) => {
        const result = await api.get(`${endpoint.customerReceipts}/${params.id}`);
        return result.data;
    },

    downloadReceiptDocument: async (id, filename) => {
        const result = await api.get(`${endpoint.customerReceipts}/${id}/document/download`, {
            responseType: 'blob',
            headers: { Accept: 'text/html, application/xhtml+xml, */*' },
        });
        downloadBlob(filename, result.data);
    },

    getNotifications: async () => {
        const result = await api.get(endpoint.customerNotifications);
        return result.data;
    },

    getPaymentMethods: async () => {
        const result = await api.get(endpoint.customerPaymentMethods);
        return result.data;
    },
};

export { service };
