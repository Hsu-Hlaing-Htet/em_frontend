import { formatCurrency, getPaymentTypeLabel, getStatusLabel } from '@/utils/formatter';

const currency = (row, field) => formatCurrency(row[field]);
const paymentType = (row) => getPaymentTypeLabel(row.payment_type);
const status = (row) => getStatusLabel(row.status || row.display_status || row.payment_status);

export function createContractExportColumns(prefix) {
    const draftKey = `${prefix}_DRAFT_EXPORT_COLUMNS`;
    const approvalKey = `${prefix}_APPROVAL_EXPORT_COLUMNS`;
    const activeKey = `${prefix}_ACTIVE_EXPORT_COLUMNS`;

    const draftColumns = [
        { field: 'contract_no', header: 'Contract No' },
        { field: 'customer_name', header: 'Customer' },
        { field: 'building_name', header: 'Building' },
        { field: 'room_number', header: 'Room' },
        { field: 'contract_total', header: 'Contract Total', type: 'currency', format: (row) => currency(row, 'contract_total') },
        { field: 'payment_type', header: 'Payment Plan Type', format: paymentType },
        { field: 'status', header: 'Status', format: status },
        { field: 'created_by', header: 'Created By' },
        { field: 'created_at', header: 'Created Date', type: 'date' },
    ];

    const approvalColumns = [
        { field: 'contract_no', header: 'Contract No' },
        { field: 'customer_name', header: 'Customer' },
        { field: 'building_name', header: 'Building' },
        { field: 'room_number', header: 'Room' },
        { field: 'contract_total', header: 'Contract Total', type: 'currency', format: (row) => currency(row, 'contract_total') },
        { field: 'payment_type', header: 'Payment Plan Type', format: paymentType },
        { field: 'created_by', header: 'Created By' },
        { field: 'created_at', header: 'Created Date', type: 'date' },
    ];

    const activeColumns = [
        { field: 'contract_no', header: 'Contract No' },
        { field: 'customer_name', header: 'Customer' },
        { field: 'building_name', header: 'Building' },
        { field: 'room_number', header: 'Room' },
        { field: 'contract_total', header: 'Contract Total', type: 'currency', format: (row) => currency(row, 'contract_total') },
        { field: 'paid_amount', header: 'Paid Amount', type: 'currency', format: (row) => currency(row, 'paid_amount') },
        { field: 'remaining_amount', header: 'Remaining Amount', type: 'currency', format: (row) => currency(row, 'remaining_amount') },
        { field: 'status', header: 'Status', format: status },
        { field: 'created_at', header: 'Created At', type: 'date' },
        { field: 'payment_type', header: 'Payment Plan Type', format: paymentType },
    ];

    return {
        [draftKey]: draftColumns,
        [approvalKey]: approvalColumns,
        [activeKey]: activeColumns,
        EXPORT_COLUMNS_BY_LIST: {
            drafts: draftColumns,
            approvals: approvalColumns,
            active: activeColumns,
        },
    };
}

export const {
    SALE_DRAFT_EXPORT_COLUMNS,
    SALE_APPROVAL_EXPORT_COLUMNS,
    ACTIVE_SALE_EXPORT_COLUMNS,
    EXPORT_COLUMNS_BY_LIST: SALE_EXPORT_COLUMNS_BY_LIST,
} = createContractExportColumns('SALE');

export const {
    RENT_DRAFT_EXPORT_COLUMNS,
    RENT_APPROVAL_EXPORT_COLUMNS,
    ACTIVE_RENT_EXPORT_COLUMNS,
    EXPORT_COLUMNS_BY_LIST: RENT_EXPORT_COLUMNS_BY_LIST,
} = createContractExportColumns('RENT');

export const BUILDING_EXPORT_COLUMNS = [
    { field: 'building_name', header: 'Building Name' },
    { field: 'location', header: 'Location' },
    { field: 'description', header: 'Description' },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const ROOM_EXPORT_COLUMNS = [
    { field: 'building_name', header: 'Building' },
    { field: 'room_number', header: 'Room' },
    { field: 'floor_number', header: 'Floor', type: 'number' },
    { field: 'area_sqft', header: 'Area (sqft)', type: 'number' },
    { field: 'type', header: 'Type' },
    { field: 'status', header: 'Status', format: status },
    { field: 'sale_price', header: 'Sale Price', type: 'currency', format: (row) => currency(row, 'sale_price') },
    { field: 'rent_price', header: 'Rent Price', type: 'currency', format: (row) => currency(row, 'rent_price') },
    { field: 'rent_deposit_price', header: 'Rent Deposit', type: 'currency', format: (row) => currency(row, 'rent_deposit_price') },
    { field: 'booking_deposit_price', header: 'Booking Deposit', type: 'currency', format: (row) => currency(row, 'booking_deposit_price') },
];

export const RESIDENT_EXPORT_COLUMNS = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'nrc', header: 'NRC' },
    { field: 'gender', header: 'Gender' },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const STAFF_EXPORT_COLUMNS = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'nrc', header: 'NRC' },
    { field: 'gender', header: 'Gender' },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const ROLE_EXPORT_COLUMNS = [
    { field: 'name', header: 'Name' },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const CHARGE_TYPE_EXPORT_COLUMNS = [
    { field: 'name', header: 'Name' },
    { field: 'status', header: 'Status', format: status },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const LATE_FEE_EXPORT_COLUMNS = [
    { field: 'name', header: 'Name' },
    { field: 'type', header: 'Type' },
    { field: 'value', header: 'Value', type: 'number' },
    { field: 'per', header: 'Per' },
    { field: 'grace_days', header: 'Grace Days', type: 'number' },
    { field: 'status', header: 'Status', format: status },
];

export const PAYMENT_PLAN_EXPORT_COLUMNS = [
    { field: 'name', header: 'Name' },
    { field: 'payment_type', header: 'Payment Type', format: paymentType },
    { field: 'duration_months', header: 'Duration (months)', type: 'number' },
    { field: 'interest_percentage', header: 'Interest %', type: 'number' },
    { field: 'status', header: 'Status', format: status },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const PAYMENT_METHOD_EXPORT_COLUMNS = [
    { field: 'name', header: 'Name' },
    { field: 'status', header: 'Status', format: status },
];

export const UTILITY_TYPE_EXPORT_COLUMNS = [
    { field: 'name', header: 'Name' },
    { field: 'status', header: 'Status', format: status },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const UTILITY_RATE_EXPORT_COLUMNS = [
    { field: 'type_name', header: 'Utility Type' },
    { field: 'unit_price', header: 'Unit Price', type: 'currency', format: (row) => currency(row, 'unit_price') },
    { field: 'effective_date', header: 'Effective Date', type: 'date' },
    { field: 'status', header: 'Status', format: status },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const MAINTENANCE_EXPORT_COLUMNS = [
    { field: 'title', header: 'Title' },
    { field: 'room_number', header: 'Room' },
    { field: 'user_name', header: 'Requested By' },
    { field: 'status', header: 'Status', format: status },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const UTILITY_EXPORT_COLUMNS = [
    { field: 'customer_name', header: 'Customer' },
    { field: 'room_number', header: 'Room' },
    { field: 'total_amount', header: 'Total Amount', type: 'currency', format: (row) => currency(row, 'total_amount') },
    { field: 'status', header: 'Status', format: status },
    { field: 'created_by_name', header: 'Created By' },
    { field: 'created_at', header: 'Created At', type: 'date' },
];

export const INVOICE_EXPORT_COLUMNS = [
    { field: 'invoice_number', header: 'Invoice No' },
    { field: 'customer_name', header: 'Customer' },
    { field: 'building_name', header: 'Building' },
    { field: 'room_number', header: 'Room' },
    { field: 'total_amount', header: 'Total Amount', type: 'currency', format: (row) => currency(row, 'total_amount') },
    { field: 'issued_date', header: 'Issued Date', type: 'date' },
    { field: 'due_date', header: 'Due Date', type: 'date' },
    { field: 'payment_status', header: 'Payment Status', format: (row) => getStatusLabel(row.payment_status || row.status) },
];

export const PAYMENT_EXPORT_COLUMNS = [
    { field: 'invoice_number', header: 'Invoice No' },
    { field: 'customer_name', header: 'Customer' },
    { field: 'property_unit', header: 'Property / Unit' },
    { field: 'invoice_amount', header: 'Invoice Amount', type: 'currency', format: (row) => currency(row, 'invoice_amount') },
    { field: 'paid_amount', header: 'Previously Paid', type: 'currency', format: (row) => currency(row, 'paid_amount') },
    { field: 'amount', header: 'Paid Amount', type: 'currency', format: (row) => currency(row, 'amount') },
    { field: 'balance', header: 'Balance', type: 'currency', format: (row) => currency(row, 'balance') },
    { field: 'payment_type', header: 'Payment Type' },
    { field: 'payment_date', header: 'Payment Date', type: 'date' },
    { field: 'payment_method_name', header: 'Payment Method' },
    { field: 'display_status', header: 'Status', format: (row) => getStatusLabel(row.display_status || row.status) },
    { field: 'note', header: 'Notes' },
];

export const RECEIPT_EXPORT_COLUMNS = [
    { field: 'receipt_number', header: 'Receipt No' },
    { field: 'customer_name', header: 'Customer' },
    { field: 'property_unit', header: 'Property / Unit' },
    { field: 'invoice_amount', header: 'Invoice Amount', type: 'currency', format: (row) => currency(row, 'invoice_amount') },
    { field: 'paid_amount', header: 'Paid Amount', type: 'currency', format: (row) => currency(row, 'paid_amount') },
    { field: 'balance', header: 'Balance', type: 'currency', format: (row) => currency(row, 'balance') },
    { field: 'payment_type', header: 'Payment Type' },
    { field: 'payment_date', header: 'Payment Date', type: 'date' },
    { field: 'payment_method_name', header: 'Payment Method' },
    { field: 'display_status', header: 'Status', format: (row) => getStatusLabel(row.display_status || row.status) },
];
