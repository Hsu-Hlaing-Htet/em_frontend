import {
    formatBillingDocumentDate,
    renderBillingDocumentBody,
    renderBillingSummaryNote,
    renderBillingTableSection,
} from './renderBillingDetailLayout';
import { hasBillingValue } from '@/helpers/billing/billingDetailHelpers';

const READING_COLUMNS = [
    { label: 'Utility Type', key: 'utility_type', align: 'left' },
    { label: 'Previous Unit', key: 'previous_reading', align: 'right' },
    { label: 'Current Unit', key: 'current_reading', align: 'right' },
    { label: 'Usage', key: 'usage', align: 'right' },
    { label: 'Unit Price', key: 'unit_price', align: 'right' },
    { label: 'Amount', key: 'amount', align: 'right' },
];

function buildCustomerInfo(customerInfo = {}) {
    const lines = [
        customerInfo.address,
        customerInfo.phone,
        customerInfo.email,
        customerInfo.building,
        customerInfo.room,
    ].filter((value) => hasBillingValue(value));

    return {
        name: customerInfo.name,
        lines,
        issuedDate: customerInfo.issuedDate,
    };
}

export function renderUtilityDocumentLead() {
    return '';
}

export function renderUtilityDocumentBody(document) {
    if (!document) {
        return '';
    }

    return renderBillingDocumentBody({
        customerInfo: buildCustomerInfo(document.customerInfo),
        tables: [{
            columns: READING_COLUMNS,
            rows: document.readings || [],
            emptyMessage: 'No utility readings recorded.',
            totalLabel: document.totalDue?.label || 'Total Amount',
            totalValue: document.totalDue?.amount,
        }],
        authorization: document.authorization,
        summaryNote: document.summaryNote,
    });
}

export { formatBillingDocumentDate, renderBillingSummaryNote, renderBillingTableSection };
