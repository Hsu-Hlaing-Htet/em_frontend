import api from '@/services/api';

export function getAdminInvoices(params = {}) {
    return api.get('/api/admin/invoices', { params });
}

export function getAdminPayments(params = {}) {
    return api.get('/api/admin/payments', { params });
}

export function createAdminInvoicePayment(invoiceId, payload) {
    return api.post(`/api/admin/invoices/${invoiceId}/payments`, payload);
}

export function updateAdminPayment(id, payload) {
    return api.put(`/api/admin/payments/${id}`, payload);
}

export function deleteAdminPayment(id) {
    return api.delete(`/api/admin/payments/${id}`);
}
