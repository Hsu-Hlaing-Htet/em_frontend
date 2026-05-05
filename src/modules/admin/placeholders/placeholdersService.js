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

export function getAdminSectionRows(section) {
    const endpoint = sectionEndpointMap[section];

    if (!endpoint) {
        return Promise.resolve({ data: [] });
    }

    return api.get(endpoint);
}
