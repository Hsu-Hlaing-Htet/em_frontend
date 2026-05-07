import api from '@/services/api';

const sectionEndpointMap = {
    owners: '/api/admin/owners',
    tenants: '/api/admin/tenants',
    contracts: '/api/admin/contracts',
    invoices: '/api/admin/invoices',
    payments: '/api/admin/payments',
    'meter-readings': '/api/admin/meter-readings',
    reports: '/api/admin/reports/unpaid-invoices',
};

export function getAdminDashboard() { return api.get('/api/admin/dashboard'); }
export function getAdminOwners() { return api.get('/api/admin/owners'); }
export function getAdminProperties(params = {}) { return api.get('/api/admin/properties', { params }); }
export function createAdminProperty(payload) { return api.post('/api/admin/properties', payload); }
export function updateAdminProperty(id, payload) { return api.put(`/api/admin/properties/${id}`, payload); }
export function deleteAdminProperty(id) { return api.delete(`/api/admin/properties/${id}`); }
export function getAdminInvoices(params = {}) { return api.get('/api/admin/invoices', { params }); }
export function getAdminPayments(params = {}) { return api.get('/api/admin/payments', { params }); }
export function createAdminInvoicePayment(invoiceId, payload) { return api.post(`/api/admin/invoices/${invoiceId}/payments`, payload); }
export function updateAdminPayment(id, payload) { return api.put(`/api/admin/payments/${id}`, payload); }
export function deleteAdminPayment(id) { return api.delete(`/api/admin/payments/${id}`); }
export function getAdminSectionRows(section) {
    const endpoint = sectionEndpointMap[section];
    if (!endpoint) return Promise.resolve({ data: [] });
    return api.get(endpoint);
}
