import { formatCurrency } from '@/utils/formatter';

export const KPI_STATS = [
    {
        key: 'revenue',
        label: 'Total Revenue',
        value: formatCurrency(2450000),
        change: '+12.4% vs last month',
        detail: `Approved payments across sale and rent portfolios total ${formatCurrency(2450000)} this quarter.`,
        icon: 'pi pi-wallet',
    },
    {
        key: 'properties',
        label: 'Properties',
        value: '48',
        change: '6 new listings',
        detail: '48 luxury units are actively managed across Rosewood Royale towers.',
        icon: 'pi pi-building',
    },
    {
        key: 'clients',
        label: 'Clients',
        value: '126',
        change: '+8 this week',
        detail: '126 resident and owner profiles are registered in the customer portal.',
        icon: 'pi pi-users',
    },
    {
        key: 'inquiries',
        label: 'Inquiries',
        value: '23',
        change: '5 awaiting reply',
        detail: '23 inbound inquiries were logged this month; 5 still need a follow-up.',
        icon: 'pi pi-inbox',
    },
];

export const REVENUE_SUMMARY = {
    total_paid: 2450000,
    outstanding: 385000,
    collected_this_month: 420000,
    growth_percent: 12.4,
};

export const REVENUE_CHART = [
    { month: 'Jan', amount: 310000 },
    { month: 'Feb', amount: 355000 },
    { month: 'Mar', amount: 390000 },
    { month: 'Apr', amount: 410000 },
    { month: 'May', amount: 435000 },
    { month: 'Jun', amount: 420000 },
    { month: 'Jul', amount: 460000 },
    { month: 'Aug', amount: 475000 },
    { month: 'Sep', amount: 490000 },
    { month: 'Oct', amount: 505000 },
    { month: 'Nov', amount: 520000 },
    { month: 'Dec', amount: 545000 },
];

export const PROPERTY_STATS = [
    { key: 'available', label: 'Available', value: 14, color: '#7a3149' },
    { key: 'reserved', label: 'Reserved', value: 8, color: '#552032' },
    { key: 'occupied', label: 'Occupied', value: 19, color: '#9b4d66' },
    { key: 'sold', label: 'Sold', value: 5, color: '#d6b8c1' },
    { key: 'maintenance', label: 'Maintenance', value: 2, color: '#8b6b74' },
];

export const INVOICE_STATS = [
    { key: 'draft', label: 'Draft', value: 4, icon: 'pi pi-file', color: '#8b6b74' },
    { key: 'issued', label: 'Issued', value: 12, icon: 'pi pi-send', color: '#552032' },
    { key: 'partial', label: 'Partial', value: 6, icon: 'pi pi-minus-circle', color: '#9b4d66' },
    { key: 'paid', label: 'Paid', value: 28, icon: 'pi pi-check', color: '#7a3149' },
    { key: 'overdue', label: 'Overdue', value: 3, icon: 'pi pi-exclamation-triangle', color: '#b42318' },
];

export const RECENT_PROPERTIES = [
    { id: 1, name: 'Penthouse 18A', building: 'Rosewood Tower', type: 'rent', status: 'available', price: 850000, area: 1450, updated_at: '2026-07-19T09:15:00' },
    { id: 2, name: 'Suite 12B', building: 'Royale Residences', type: 'sale', status: 'reserved', price: 1250000, area: 1680, updated_at: '2026-07-18T16:40:00' },
    { id: 3, name: 'Unit 7C', building: 'Rosewood Tower', type: 'rent', status: 'occupied', price: 520000, area: 980, updated_at: '2026-07-18T11:20:00' },
    { id: 4, name: 'Villa 3D', building: 'Garden Wing', type: 'sale', status: 'sold', price: 2100000, area: 2200, updated_at: '2026-07-17T14:05:00' },
    { id: 5, name: 'Studio 5E', building: 'Royale Residences', type: 'rent', status: 'maintenance', price: 380000, area: 620, updated_at: '2026-07-17T08:50:00' },
    { id: 6, name: 'Duplex 9F', building: 'Rosewood Tower', type: 'sale', status: 'available', price: 1680000, area: 1850, updated_at: '2026-07-16T18:30:00' },
    { id: 7, name: 'Unit 11A', building: 'Garden Wing', type: 'rent', status: 'occupied', price: 610000, area: 1100, updated_at: '2026-07-16T10:10:00' },
    { id: 8, name: 'Suite 14C', building: 'Royale Residences', type: 'rent', status: 'reserved', price: 720000, area: 1280, updated_at: '2026-07-15T13:45:00' },
];

export const RECENT_CLIENTS = [
    { id: 1, name: 'Mg Mg Aung', email: 'mgmg@rosewoodroyale.com', phone: '+95 9 123 456 789', type: 'tenant', status: 'active', contracts: 1, updated_at: '2026-07-19T08:00:00' },
    { id: 2, name: 'Hnin Hnin Wai', email: 'hnin@example.com', phone: '+95 9 234 567 890', type: 'owner', status: 'active', contracts: 2, updated_at: '2026-07-18T17:30:00' },
    { id: 3, name: 'Kyaw Kyaw Soe', email: 'kyaw@example.com', phone: '+95 9 345 678 901', type: 'tenant', status: 'inactive', contracts: 0, updated_at: '2026-07-18T12:15:00' },
    { id: 4, name: 'Su Su Mon', email: 'susu@example.com', phone: '+95 9 456 789 012', type: 'owner', status: 'active', contracts: 1, updated_at: '2026-07-17T15:20:00' },
    { id: 5, name: 'Zaw Win Htut', email: 'zaw@example.com', phone: '+95 9 567 890 123', type: 'tenant', status: 'active', contracts: 1, updated_at: '2026-07-17T09:40:00' },
    { id: 6, name: 'May Thu Zar', email: 'may@example.com', phone: '+95 9 678 901 234', type: 'tenant', status: 'active', contracts: 2, updated_at: '2026-07-16T11:55:00' },
    { id: 7, name: 'Aung Ko Latt', email: 'aung@example.com', phone: '+95 9 789 012 345', type: 'owner', status: 'inactive', contracts: 1, updated_at: '2026-07-15T16:10:00' },
];

export const RECENT_INQUIRIES = [
    { id: 1, reference: 'INQ-2026-014', client: 'Thiri Myat Noe', subject: 'Penthouse viewing request', channel: 'website', status: 'pending', priority: 'high', updated_at: '2026-07-19T10:30:00' },
    { id: 2, reference: 'INQ-2026-013', client: 'Phone Myat Min', subject: 'Rent payment plan options', channel: 'phone', status: 'in_progress', priority: 'medium', updated_at: '2026-07-19T07:45:00' },
    { id: 3, reference: 'INQ-2026-012', client: 'Ei Mon Kyaw', subject: 'Sale contract documentation', channel: 'email', status: 'approved', priority: 'low', updated_at: '2026-07-18T19:00:00' },
    { id: 4, reference: 'INQ-2026-011', client: 'Min Khant Zaw', subject: 'Maintenance follow-up', channel: 'portal', status: 'pending', priority: 'medium', updated_at: '2026-07-18T14:20:00' },
    { id: 5, reference: 'INQ-2026-010', client: 'Phyo Wai Lwin', subject: 'Parking allocation inquiry', channel: 'website', status: 'rejected', priority: 'low', updated_at: '2026-07-17T11:10:00' },
    { id: 6, reference: 'INQ-2026-009', client: 'Nyein Chan Aye', subject: 'Unit availability for Q3', channel: 'email', status: 'in_progress', priority: 'high', updated_at: '2026-07-16T13:35:00' },
];

export const CONTRACTS = [
    { id: 1, number: 'CTR-2026-0048', client: 'Mg Mg Aung', property: 'Unit 7C', type: 'rent', status: 'active', value: 6240000, start_date: '2025-08-01', end_date: '2026-07-31', updated_at: '2026-07-19T06:00:00' },
    { id: 2, number: 'CTR-2026-0047', client: 'Hnin Hnin Wai', property: 'Suite 12B', type: 'sale', status: 'pending_approval', value: 1250000, start_date: '2026-07-01', end_date: '2027-06-30', updated_at: '2026-07-18T15:30:00' },
    { id: 3, number: 'CTR-2026-0046', client: 'Su Su Mon', property: 'Villa 3D', type: 'sale', status: 'completed', value: 2100000, start_date: '2026-01-15', end_date: '2026-07-15', updated_at: '2026-07-17T12:00:00' },
    { id: 4, number: 'CTR-2026-0045', client: 'Zaw Win Htut', property: 'Unit 11A', type: 'rent', status: 'active', value: 7320000, start_date: '2025-11-01', end_date: '2026-10-31', updated_at: '2026-07-17T09:15:00' },
    { id: 5, number: 'CTR-2026-0044', client: 'May Thu Zar', property: 'Suite 14C', type: 'rent', status: 'draft', value: 8640000, start_date: '2026-08-01', end_date: '2027-07-31', updated_at: '2026-07-16T08:45:00' },
    { id: 6, number: 'CTR-2026-0043', client: 'Kyaw Kyaw Soe', property: 'Studio 5E', type: 'rent', status: 'cancelled', value: 4560000, start_date: '2025-05-01', end_date: '2026-04-30', updated_at: '2026-07-15T17:20:00' },
];

export const INVOICES = [
    { id: 1, number: 'INV-2026-0312', client: 'Mg Mg Aung', contract: 'CTR-2026-0048', amount: 520000, status: 'issued', due_date: '2026-07-25', updated_at: '2026-07-19T08:30:00' },
    { id: 2, number: 'INV-2026-0311', client: 'Zaw Win Htut', contract: 'CTR-2026-0045', amount: 610000, status: 'paid', due_date: '2026-07-10', updated_at: '2026-07-18T16:00:00' },
    { id: 3, number: 'INV-2026-0310', client: 'May Thu Zar', contract: 'CTR-2026-0044', amount: 720000, status: 'partial', due_date: '2026-07-20', updated_at: '2026-07-18T11:45:00' },
    { id: 4, number: 'INV-2026-0309', client: 'Hnin Hnin Wai', contract: 'CTR-2026-0047', amount: 125000, status: 'overdue', due_date: '2026-07-05', updated_at: '2026-07-17T09:20:00' },
    { id: 5, number: 'INV-2026-0308', client: 'Su Su Mon', contract: 'CTR-2026-0046', amount: 350000, status: 'paid', due_date: '2026-07-01', updated_at: '2026-07-16T14:10:00' },
    { id: 6, number: 'INV-2026-0307', client: 'Mg Mg Aung', contract: 'CTR-2026-0048', amount: 520000, status: 'draft', due_date: '2026-08-01', updated_at: '2026-07-15T10:00:00' },
];

export const PAYMENTS = [
    {
        id: 1,
        reference: 'INV-000311',
        reference_number: 'INV-000311',
        client: 'Zaw Win Htut',
        customer_name: 'Zaw Win Htut',
        invoice: 'INV-000311',
        invoice_number: 'INV-000311',
        property_unit: 'Garden Wing · Unit 11A',
        payment_type: 'rent',
        invoice_amount: 610000,
        paid_amount: 610000,
        amount: 610000,
        balance: 0,
        method: 'Bank Transfer',
        payment_method_name: 'Bank Transfer',
        display_status: 'paid',
        status: 'approved',
        payment_date: '2026-07-18',
        paid_at: '2026-07-18T15:45:00',
        note: 'July rent settled in full.',
        receipt_id: 12,
    },
    {
        id: 2,
        reference: 'INV-000310',
        reference_number: 'INV-000310',
        client: 'May Thu Zar',
        customer_name: 'May Thu Zar',
        invoice: 'INV-000310',
        invoice_number: 'INV-000310',
        property_unit: 'Royale Residences · Suite 14C',
        payment_type: 'utility',
        invoice_amount: 360000,
        paid_amount: 0,
        amount: 360000,
        balance: 360000,
        method: 'KBZPay',
        payment_method_name: 'KBZPay',
        display_status: 'pending',
        status: 'pending',
        payment_date: '2026-07-18',
        paid_at: '2026-07-18T10:20:00',
        note: 'Awaiting finance verification.',
        receipt_id: null,
    },
    {
        id: 3,
        reference: 'INV-000308',
        reference_number: 'INV-000308',
        client: 'Su Su Mon',
        customer_name: 'Su Su Mon',
        invoice: 'INV-000308',
        invoice_number: 'INV-000308',
        property_unit: 'Rosewood Tower · Villa 3D',
        payment_type: 'other',
        invoice_amount: 700000,
        paid_amount: 350000,
        amount: 350000,
        balance: 350000,
        method: 'Bank Transfer',
        payment_method_name: 'Bank Transfer',
        display_status: 'partial',
        status: 'approved',
        payment_date: '2026-07-16',
        paid_at: '2026-07-16T13:30:00',
        note: 'First installment received.',
        receipt_id: 11,
    },
    {
        id: 4,
        reference: 'INV-000312',
        reference_number: 'INV-000312',
        client: 'Mg Mg Aung',
        customer_name: 'Mg Mg Aung',
        invoice: 'INV-000312',
        invoice_number: 'INV-000312',
        property_unit: 'Rosewood Tower · Unit 7C',
        payment_type: 'rent',
        invoice_amount: 520000,
        paid_amount: 0,
        amount: 520000,
        balance: 520000,
        method: 'Cash',
        payment_method_name: 'Cash',
        display_status: 'pending',
        status: 'pending',
        payment_date: '2026-07-19',
        paid_at: '2026-07-19T07:00:00',
        note: 'Counter payment submitted.',
        receipt_id: null,
    },
    {
        id: 5,
        reference: 'INV-000309',
        reference_number: 'INV-000309',
        client: 'Hnin Hnin Wai',
        customer_name: 'Hnin Hnin Wai',
        invoice: 'INV-000309',
        invoice_number: 'INV-000309',
        property_unit: 'Garden Wing · Studio 5E',
        payment_type: 'maintenance',
        invoice_amount: 125000,
        paid_amount: 0,
        amount: 125000,
        balance: 125000,
        method: 'WavePay',
        payment_method_name: 'WavePay',
        display_status: 'overdue',
        status: 'pending',
        payment_date: '2026-07-17',
        paid_at: '2026-07-17T08:15:00',
        note: 'Maintenance fee overdue follow-up required.',
        receipt_id: null,
    },
    {
        id: 6,
        reference: 'INV-000305',
        reference_number: 'INV-000305',
        client: 'Kyaw Kyaw Soe',
        customer_name: 'Kyaw Kyaw Soe',
        invoice: 'INV-000305',
        invoice_number: 'INV-000305',
        property_unit: 'Royale Residences · Studio 5E',
        payment_type: 'utility',
        invoice_amount: 98000,
        paid_amount: 98000,
        amount: 98000,
        balance: 0,
        method: 'KBZPay',
        payment_method_name: 'KBZPay',
        display_status: 'paid',
        status: 'approved',
        payment_date: '2026-07-15',
        paid_at: '2026-07-15T11:10:00',
        note: 'Utility bill cleared.',
        receipt_id: 10,
    },
    {
        id: 7,
        reference: 'INV-000304',
        reference_number: 'INV-000304',
        client: 'Nyein Chan Aye',
        customer_name: 'Nyein Chan Aye',
        invoice: 'INV-000304',
        invoice_number: 'INV-000304',
        property_unit: 'Rosewood Tower · Duplex 9F',
        payment_type: 'rent',
        invoice_amount: 840000,
        paid_amount: 420000,
        amount: 420000,
        balance: 420000,
        method: 'Bank Transfer',
        payment_method_name: 'Bank Transfer',
        display_status: 'partial',
        status: 'approved',
        payment_date: '2026-07-14',
        paid_at: '2026-07-14T09:40:00',
        note: 'Partial rent payment recorded.',
        receipt_id: 9,
    },
    {
        id: 8,
        reference: 'INV-000303',
        reference_number: 'INV-000303',
        client: 'Phone Myat Min',
        customer_name: 'Phone Myat Min',
        invoice: 'INV-000303',
        invoice_number: 'INV-000303',
        property_unit: 'Garden Wing · Suite 12B',
        payment_type: 'rent',
        invoice_amount: 450000,
        paid_amount: 450000,
        amount: 450000,
        balance: 0,
        method: 'Cash',
        payment_method_name: 'Cash',
        display_status: 'paid',
        status: 'approved',
        payment_date: '2026-07-13',
        paid_at: '2026-07-13T16:25:00',
        note: 'Cash received at front desk.',
        receipt_id: 8,
    },
];

export const NOTIFICATIONS = [
    { id: 1, title: 'Invoice issued', message: 'INV-2026-0312 was issued to Mg Mg Aung.', type: 'billing', status: 'unread', created_at: '2026-07-19T08:30:00' },
    { id: 2, title: 'Payment approved', message: 'PAY-2026-0188 for 610,000 MMK was approved.', type: 'billing', status: 'read', created_at: '2026-07-18T16:05:00' },
    { id: 3, title: 'New inquiry', message: 'Thiri Myat Noe submitted a penthouse viewing request.', type: 'inquiry', status: 'unread', created_at: '2026-07-19T10:30:00' },
    { id: 4, title: 'Contract pending approval', message: 'CTR-2026-0047 awaits admin review.', type: 'contract', status: 'unread', created_at: '2026-07-18T15:35:00' },
    { id: 5, title: 'Maintenance scheduled', message: 'Studio 5E maintenance window confirmed.', type: 'operations', status: 'read', created_at: '2026-07-17T09:00:00' },
    { id: 6, title: 'Overdue invoice', message: 'INV-2026-0309 is 14 days overdue.', type: 'billing', status: 'unread', created_at: '2026-07-19T06:00:00' },
];

export const ACTIVITY_TIMELINE = [
    { id: 1, icon: 'pi pi-dollar', title: 'Payment approved', detail: 'Zaw Win Htut paid INV-2026-0311 via bank transfer.', time: '2 hours ago', tag: 'billing', status: 'approved' },
    { id: 2, icon: 'pi pi-inbox', title: 'Inquiry received', detail: 'Thiri Myat Noe requested a penthouse viewing.', time: '1 hour ago', tag: 'inquiry', status: 'pending' },
    { id: 3, icon: 'pi pi-file', title: 'Contract submitted', detail: 'CTR-2026-0047 moved to pending approval.', time: 'Yesterday', tag: 'contract', status: 'pending_approval' },
    { id: 4, icon: 'pi pi-building', title: 'Property listed', detail: 'Penthouse 18A is now available for rent.', time: 'Yesterday', tag: 'property', status: 'available' },
    { id: 5, icon: 'pi pi-exclamation-triangle', title: 'Invoice overdue', detail: 'INV-2026-0309 requires immediate follow-up.', time: '2 days ago', tag: 'billing', status: 'overdue' },
    { id: 6, icon: 'pi pi-users', title: 'Client registered', detail: 'May Thu Zar completed portal onboarding.', time: '3 days ago', tag: 'client', status: 'active' },
    { id: 7, icon: 'pi pi-wrench', title: 'Maintenance logged', detail: 'Studio 5E entered maintenance status.', time: '3 days ago', tag: 'operations', status: 'maintenance' },
    { id: 8, icon: 'pi pi-check-circle', title: 'Sale completed', detail: 'Villa 3D sale contract marked completed.', time: '4 days ago', tag: 'contract', status: 'completed' },
];

export const QUICK_ACTIONS = [
    { label: 'Manage Rooms', icon: 'pi pi-building', to: '/admin/rooms' },
    { label: 'Manage Residents', icon: 'pi pi-users', to: '/admin/residents' },
    { label: 'Manage Staff', icon: 'pi pi-id-card', to: '/admin/staff' },
    { label: 'Utility Types', icon: 'pi pi-bolt', to: '/admin/utility-types' },
    { label: 'Charge Types', icon: 'pi pi-receipt', to: '/admin/charge-types' },
    { label: 'Payment Methods', icon: 'pi pi-wallet', to: '/admin/payment-methods' },
];

export const STATUS_FILTER_OPTIONS = {
    properties: ['all', 'available', 'reserved', 'occupied', 'sold', 'maintenance'],
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

export const AGENTS = [
    { id: 1, name: 'Daw Khin Khin', email: 'khin@rosewoodroyale.com', phone: '+95 9 111 222 333', department: 'Sales', listings: 12, deals_closed: 8, status: 'active', updated_at: '2026-07-19T09:00:00' },
    { id: 2, name: 'U Aung Myint', email: 'aungm@rosewoodroyale.com', phone: '+95 9 222 333 444', department: 'Leasing', listings: 9, deals_closed: 5, status: 'active', updated_at: '2026-07-18T14:30:00' },
    { id: 3, name: 'Ma Phyu Phyu', email: 'phyu@rosewoodroyale.com', phone: '+95 9 333 444 555', department: 'Sales', listings: 7, deals_closed: 4, status: 'active', updated_at: '2026-07-17T11:15:00' },
    { id: 4, name: 'Ko Min Thu', email: 'minthu@rosewoodroyale.com', phone: '+95 9 444 555 666', department: 'Leasing', listings: 6, deals_closed: 3, status: 'inactive', updated_at: '2026-07-16T08:40:00' },
    { id: 5, name: 'Ma Ei Ei', email: 'eiei@rosewoodroyale.com', phone: '+95 9 555 666 777', department: 'Sales', listings: 10, deals_closed: 6, status: 'active', updated_at: '2026-07-15T16:20:00' },
];

export const TENANTS = [
    { id: 1, name: 'Mg Mg Aung', unit: 'Unit 7C', building: 'Rosewood Tower', lease_start: '2025-08-01', lease_end: '2026-07-31', rent: 520000, status: 'active', updated_at: '2026-07-19T06:00:00' },
    { id: 2, name: 'Zaw Win Htut', unit: 'Unit 11A', building: 'Garden Wing', lease_start: '2025-11-01', lease_end: '2026-10-31', rent: 610000, status: 'active', updated_at: '2026-07-17T09:15:00' },
    { id: 3, name: 'May Thu Zar', unit: 'Suite 14C', building: 'Royale Residences', lease_start: '2025-06-01', lease_end: '2026-05-31', rent: 720000, status: 'active', updated_at: '2026-07-16T11:55:00' },
    { id: 4, name: 'Kyaw Kyaw Soe', unit: 'Studio 5E', building: 'Royale Residences', lease_start: '2025-05-01', lease_end: '2026-04-30', rent: 380000, status: 'expired', updated_at: '2026-07-15T17:20:00' },
    { id: 5, name: 'Nyein Chan Aye', unit: 'Duplex 9F', building: 'Rosewood Tower', lease_start: '2026-07-01', lease_end: '2027-06-30', rent: 840000, status: 'pending', updated_at: '2026-07-14T10:30:00' },
];

export const BOOKINGS = [
    { id: 1, reference: 'BKG-2026-0088', client: 'Thiri Myat Noe', property: 'Penthouse 18A', type: 'viewing', scheduled_at: '2026-07-20T14:00:00', agent: 'Daw Khin Khin', status: 'confirmed', updated_at: '2026-07-19T10:30:00' },
    { id: 2, reference: 'BKG-2026-0087', client: 'Phone Myat Min', property: 'Suite 12B', type: 'reservation', scheduled_at: '2026-07-21T11:00:00', agent: 'U Aung Myint', status: 'pending', updated_at: '2026-07-19T07:45:00' },
    { id: 3, reference: 'BKG-2026-0086', client: 'Ei Mon Kyaw', property: 'Villa 3D', type: 'viewing', scheduled_at: '2026-07-18T16:00:00', agent: 'Ma Phyu Phyu', status: 'completed', updated_at: '2026-07-18T19:00:00' },
    { id: 4, reference: 'BKG-2026-0085', client: 'Min Khant Zaw', property: 'Studio 5E', type: 'maintenance_visit', scheduled_at: '2026-07-22T09:30:00', agent: 'Ko Min Thu', status: 'confirmed', updated_at: '2026-07-18T14:20:00' },
    { id: 5, reference: 'BKG-2026-0084', client: 'Phyo Wai Lwin', property: 'Unit 11A', type: 'viewing', scheduled_at: '2026-07-17T15:00:00', agent: 'Ma Ei Ei', status: 'cancelled', updated_at: '2026-07-17T11:10:00' },
];

export const MAINTENANCE_REQUESTS = [
    { id: 1, reference: 'MNT-2026-0034', tenant: 'Mg Mg Aung', unit: 'Unit 7C', category: 'Plumbing', priority: 'high', status: 'in_progress', reported_at: '2026-07-19T08:00:00', updated_at: '2026-07-19T09:30:00' },
    { id: 2, reference: 'MNT-2026-0033', tenant: 'Zaw Win Htut', unit: 'Unit 11A', category: 'Electrical', priority: 'medium', status: 'pending', reported_at: '2026-07-18T17:00:00', updated_at: '2026-07-18T17:30:00' },
    { id: 3, reference: 'MNT-2026-0032', tenant: 'May Thu Zar', unit: 'Suite 14C', category: 'HVAC', priority: 'low', status: 'completed', reported_at: '2026-07-17T10:00:00', updated_at: '2026-07-17T15:00:00' },
    { id: 4, reference: 'MNT-2026-0031', tenant: 'Kyaw Kyaw Soe', unit: 'Studio 5E', category: 'General', priority: 'medium', status: 'scheduled', reported_at: '2026-07-16T09:00:00', updated_at: '2026-07-16T12:00:00' },
    { id: 5, reference: 'MNT-2026-0030', tenant: 'Nyein Chan Aye', unit: 'Duplex 9F', category: 'Appliance', priority: 'high', status: 'pending', reported_at: '2026-07-15T14:30:00', updated_at: '2026-07-15T16:00:00' },
];

export const REPORTS = [
    { id: 1, name: 'Monthly Revenue Summary', category: 'finance', format: 'PDF', period: 'July 2026', status: 'ready', generated_at: '2026-07-19T06:00:00' },
    { id: 2, name: 'Occupancy Report', category: 'operations', format: 'Excel', period: 'Q2 2026', status: 'ready', generated_at: '2026-07-18T12:00:00' },
    { id: 3, name: 'Agent Performance', category: 'people', format: 'PDF', period: 'June 2026', status: 'ready', generated_at: '2026-07-17T09:00:00' },
    { id: 4, name: 'Outstanding Invoices', category: 'finance', format: 'Excel', period: 'Current', status: 'generating', generated_at: '2026-07-19T10:00:00' },
    { id: 5, name: 'Maintenance SLA', category: 'operations', format: 'PDF', period: 'H1 2026', status: 'scheduled', generated_at: '2026-07-16T08:00:00' },
];

export const REPORT_STATS = [
    { key: 'finance', label: 'Finance', value: 12, color: '#7a3149' },
    { key: 'operations', label: 'Operations', value: 8, color: '#552032' },
    { key: 'people', label: 'People', value: 5, color: '#9b4d66' },
    { key: 'compliance', label: 'Compliance', value: 3, color: '#d6b8c1' },
];

export const ROLES = [
    { id: 1, name: 'Super Admin', users: 2, permissions: 24, status: 'active', updated_at: '2026-07-19T08:00:00' },
    { id: 2, name: 'Property Manager', users: 4, permissions: 18, status: 'active', updated_at: '2026-07-18T14:00:00' },
    { id: 3, name: 'Leasing Agent', users: 6, permissions: 12, status: 'active', updated_at: '2026-07-17T11:00:00' },
    { id: 4, name: 'Accountant', users: 2, permissions: 10, status: 'active', updated_at: '2026-07-16T09:30:00' },
    { id: 5, name: 'Customer Portal', users: 126, permissions: 6, status: 'active', updated_at: '2026-07-15T16:00:00' },
];

export const PERMISSION_MODULES = [
    { module: 'Properties', view: true, create: true, edit: true, delete: false },
    { module: 'Contracts', view: true, create: true, edit: true, delete: false },
    { module: 'Invoices', view: true, create: true, edit: true, delete: false },
    { module: 'Payments', view: true, create: false, edit: true, delete: false },
    { module: 'Users', view: true, create: true, edit: true, delete: true },
    { module: 'Reports', view: true, create: true, edit: false, delete: false },
];

export const DASHBOARD_SETTINGS = {
    auto_refresh: false,
    refresh_interval_seconds: 60,
    default_section: 'overview',
    email_digest: true,
    slack_alerts: false,
    currency: 'MMK',
    date_format: 'MMM D, YYYY',
    timezone: 'Asia/Yangon',
    compact_tables: false,
    show_revenue_chart: true,
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
