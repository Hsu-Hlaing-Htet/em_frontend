import { useListControls } from '../useListControls';

const LIST_CONTROL_CONFIG = {
    properties: {
        searchKeys: ['name', 'building', 'type'],
        defaultSort: 'updated_at',
        pageSize: 5,
    },
    customers: {
        searchKeys: ['name', 'email', 'phone'],
        defaultSort: 'updated_at',
        pageSize: 5,
    },
    agents: {
        searchKeys: ['name', 'email', 'department'],
        defaultSort: 'updated_at',
        pageSize: 5,
    },
    tenants: {
        searchKeys: ['name', 'unit', 'building'],
        defaultSort: 'updated_at',
        pageSize: 5,
    },
    inquiries: {
        searchKeys: ['reference', 'client', 'subject'],
        defaultSort: 'updated_at',
        pageSize: 5,
    },
    contracts: {
        searchKeys: ['number', 'client', 'property'],
        defaultSort: 'updated_at',
        pageSize: 5,
    },
    invoices: {
        searchKeys: ['number', 'client', 'contract'],
        defaultSort: 'updated_at',
        pageSize: 5,
    },
    payments: {
        searchKeys: [
            'reference',
            'reference_number',
            'customer_name',
            'client',
            'invoice_number',
            'invoice',
            'property_unit',
            'payment_method_name',
            'method',
            'note',
        ],
        statusKey: 'display_status',
        defaultSort: 'payment_date',
        pageSize: 5,
    },
    bookings: {
        searchKeys: ['reference', 'client', 'property', 'agent'],
        defaultSort: 'scheduled_at',
        pageSize: 5,
    },
    maintenance: {
        searchKeys: ['reference', 'tenant', 'unit', 'category'],
        defaultSort: 'updated_at',
        pageSize: 5,
    },
    notifications: {
        searchKeys: ['title', 'message', 'type'],
        defaultSort: 'created_at',
        pageSize: 5,
    },
    reports: {
        searchKeys: ['name', 'category', 'period'],
        defaultSort: 'generated_at',
        pageSize: 5,
    },
    roles: {
        searchKeys: ['name'],
        defaultSort: 'updated_at',
        pageSize: 5,
    },
};

export function useDashboardControls(dataRefs) {
    return Object.fromEntries(
        Object.entries(LIST_CONTROL_CONFIG).map(([key, config]) => [
            key,
            useListControls(dataRefs[key], config),
        ]),
    );
}

export const SEARCHABLE_CONTROL_KEYS = Object.keys(LIST_CONTROL_CONFIG);
