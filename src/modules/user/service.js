import api from '@/services/api';

export function getOwnerDashboard() { return api.get('/api/owner/dashboard'); }
export function getOwnerProperties() { return api.get('/api/owner/my-properties'); }
export function getOwnerInvoices(params = {}) { return api.get('/api/owner/my-invoices', { params }); }
export function getOwnerInvoice(id) { return api.get(`/api/owner/my-invoices/${id}`); }
export function payOwnerInvoice(id, payload) { return api.post(`/api/owner/my-invoices/${id}/pay`, payload); }
export function getOwnerPayments() { return api.get('/api/owner/my-payments'); }
export function getOwnerReceipt(id) { return api.get(`/api/owner/receipts/${id}`); }
