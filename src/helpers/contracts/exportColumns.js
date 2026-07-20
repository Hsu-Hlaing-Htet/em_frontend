import { formatCurrency, getPaymentTypeLabel, getStatusLabel } from '@/utils/formatter';

const currency = (row, field) => formatCurrency(row[field]);
const paymentType = (row) => getPaymentTypeLabel(row.payment_type);
const status = (row) => getStatusLabel(row.status);

export function createContractExportColumns(prefix) {
    const draftKey = `${prefix}_DRAFT_EXPORT_COLUMNS`;
    const approvalKey = `${prefix}_APPROVAL_EXPORT_COLUMNS`;
    const activeKey = `${prefix}_ACTIVE_EXPORT_COLUMNS`;

    const draftColumns = [
        { field: 'contract_no', header: 'Contract No' },
        { field: 'customer_name', header: 'Customer' },
        { field: 'building_name', header: 'Building' },
        { field: 'room_number', header: 'Room' },
        { field: 'contract_total', header: 'Contract Total', format: (row) => currency(row, 'contract_total') },
        { field: 'payment_type', header: 'Payment Plan Type', format: paymentType },
        { field: 'status', header: 'Status', format: status },
        { field: 'created_by', header: 'Created By' },
        { field: 'created_at', header: 'Created Date' },
    ];

    const approvalColumns = [
        { field: 'contract_no', header: 'Contract No' },
        { field: 'customer_name', header: 'Customer' },
        { field: 'building_name', header: 'Building' },
        { field: 'room_number', header: 'Room' },
        { field: 'contract_total', header: 'Contract Total', format: (row) => currency(row, 'contract_total') },
        { field: 'payment_type', header: 'Payment Plan Type', format: paymentType },
        { field: 'created_by', header: 'Created By' },
        { field: 'created_at', header: 'Created Date' },
    ];

    const activeColumns = [
        { field: 'contract_no', header: 'Contract No' },
        { field: 'customer_name', header: 'Customer' },
        { field: 'building_name', header: 'Building' },
        { field: 'room_number', header: 'Room' },
        { field: 'contract_total', header: 'Contract Total', format: (row) => currency(row, 'contract_total') },
        { field: 'paid_amount', header: 'Paid Amount', format: (row) => currency(row, 'paid_amount') },
        { field: 'remaining_amount', header: 'Remaining Amount', format: (row) => currency(row, 'remaining_amount') },
        { field: 'status', header: 'Status', format: status },
        { field: 'created_at', header: 'Created At' },
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
