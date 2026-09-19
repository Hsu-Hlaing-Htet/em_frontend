import api from '@/libs/axios';
import { endpoint } from '@/services/endpoint';
import { downloadPdfResponse, PDF_DOWNLOAD_HEADERS } from '@/utils/downloadPdfResponse';

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

    downloadContractDocument: async (id, fallbackFilename = 'contract.pdf') => {
        const response = await api.get(`${endpoint.customerContracts}/${id}/document/download`, {
            responseType: 'blob',
            headers: PDF_DOWNLOAD_HEADERS,
        });
        return downloadPdfResponse(response, fallbackFilename);
    },

    getInvoices: async (params) => {
        const result = await api.get(endpoint.customerInvoices, { params });
        return result.data;
    },

    getInvoice: async (params) => {
        const result = await api.get(`${endpoint.customerInvoices}/${params.id}`);
        return result.data;
    },

    downloadInvoiceDocument: async (id, fallbackFilename = 'invoice.pdf') => {
        const response = await api.get(`${endpoint.customerInvoices}/${id}/document/download`, {
            responseType: 'blob',
            headers: PDF_DOWNLOAD_HEADERS,
        });
        return downloadPdfResponse(response, fallbackFilename);
    },

    getPayments: async (params) => {
        const result = await api.get(endpoint.customerPayments, { params });
        return result.data;
    },

    getPayment: async (params) => {
        const result = await api.get(`${endpoint.customerPayments}/${params.id}`);
        return result.data;
    },

    submitPayment: async (params) => {
        const formData = new FormData();
        formData.append('invoice_id', params.invoice_id);
        formData.append('amount', params.amount);
        formData.append('payment_method_id', params.payment_method_id);
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

    downloadReceiptDocument: async (id, fallbackFilename = 'receipt.pdf') => {
        const response = await api.get(`${endpoint.customerReceipts}/${id}/document/download`, {
            responseType: 'blob',
            headers: PDF_DOWNLOAD_HEADERS,
        });
        return downloadPdfResponse(response, fallbackFilename);
    },

    getNotifications: async () => {
        const result = await api.get(endpoint.customerNotifications);
        return result.data;
    },

    getPaymentMethods: async () => {
        const result = await api.get(endpoint.customerPaymentMethods);
        return result.data;
    },

    getMaintenanceRooms: async () => {
        const result = await api.get(endpoint.customerMaintenanceRooms);
        return result.data;
    },

    getMaintenanceCategories: async () => {
        const result = await api.get(endpoint.customerMaintenanceCategories);
        return result.data;
    },

    getMaintenanceRequests: async (params) => {
        const result = await api.get(endpoint.customerMaintenanceRequests, { params });
        return result.data;
    },

    getMaintenanceRequest: async (params) => {
        const result = await api.get(`${endpoint.customerMaintenanceRequests}/${params.id}`);
        return result.data;
    },

    createMaintenanceRequest: async (params) => {
        const formData = new FormData();
        formData.append('room_id', params.room_id);
        formData.append('title', params.title);
        formData.append('maintenance_category_id', params.maintenance_category_id);
        formData.append('priority', params.priority);
        formData.append('description', params.description || '');

        if (params.photo) {
            formData.append('photo', params.photo);
        }

        const result = await api.post(endpoint.customerMaintenanceRequests, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return result.data;
    },

    askRentQuestion: async (params) => {
        const result = await api.post(endpoint.customerAiRentAsk, params);
        return result.data;
    },
};

export { service };
