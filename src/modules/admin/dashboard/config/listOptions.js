export const STATUS_FILTER_OPTIONS = {
    properties: ['all', 'available', 'occupied', 'sold'],
    customers: ['all', 'active', 'inactive'],
    clients: ['all', 'active', 'inactive'],
    agents: ['all', 'active', 'inactive'],
    tenants: ['all', 'active', 'pending', 'expired'],
    inquiries: ['all', 'pending', 'in_progress', 'approved', 'rejected'],
    contracts: ['all', 'draft', 'pending_approval', 'active', 'completed', 'cancelled'],
    invoices: ['all', 'draft', 'issued', 'partial', 'paid', 'overdue'],
    payments: ['all', 'paid', 'partial', 'pending', 'overdue'],
    bookings: ['all', 'pending', 'confirmed', 'completed', 'cancelled'],
    maintenance: ['all', 'pending', 'scheduled', 'in_progress', 'completed'],
    notifications: ['all', 'unread', 'read'],
    activity: ['all', 'billing', 'inquiry', 'contract', 'property', 'client', 'operations'],
    reports: ['all', 'ready', 'generating', 'scheduled'],
    roles: ['all', 'active', 'inactive'],
};

export const SORT_OPTIONS = {
    properties: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'name', label: 'Name' },
        { value: 'price', label: 'Price' },
    ],
    customers: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'name', label: 'Name' },
        { value: 'contracts', label: 'Contracts' },
    ],
    clients: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'name', label: 'Name' },
        { value: 'contracts', label: 'Contracts' },
    ],
    agents: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'name', label: 'Name' },
        { value: 'deals_closed', label: 'Deals closed' },
    ],
    tenants: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'name', label: 'Name' },
        { value: 'rent', label: 'Rent' },
    ],
    bookings: [
        { value: 'scheduled_at', label: 'Scheduled date' },
        { value: 'reference', label: 'Reference' },
        { value: 'client', label: 'Client' },
    ],
    maintenance: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'reference', label: 'Reference' },
        { value: 'priority', label: 'Priority' },
    ],
    reports: [
        { value: 'generated_at', label: 'Generated date' },
        { value: 'name', label: 'Name' },
        { value: 'category', label: 'Category' },
    ],
    roles: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'name', label: 'Name' },
        { value: 'users', label: 'Users' },
    ],
    inquiries: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'reference', label: 'Reference' },
        { value: 'client', label: 'Client' },
    ],
    contracts: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'number', label: 'Contract number' },
        { value: 'value', label: 'Value' },
    ],
    invoices: [
        { value: 'updated_at', label: 'Last updated' },
        { value: 'amount', label: 'Amount' },
        { value: 'due_date', label: 'Due date' },
    ],
    payments: [
        { value: 'payment_date', label: 'Payment date' },
        { value: 'invoice_amount', label: 'Invoice amount' },
        { value: 'invoice_number', label: 'Invoice No' },
    ],
    notifications: [
        { value: 'created_at', label: 'Created date' },
        { value: 'title', label: 'Title' },
    ],
    activity: [
        { value: 'time', label: 'Recent first' },
        { value: 'title', label: 'Title' },
    ],
};
