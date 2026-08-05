import {
    formatBillingDocumentDate,
    hasBillingValue,
} from '@/helpers/billing/billingDetailHelpers';

function isNumericId(value) {
    return /^\d+$/.test(String(value ?? '').trim());
}

export function isMeaningfulCurrencyValue(value) {
    if (!hasBillingValue(value)) {
        return false;
    }

    const digits = String(value).replace(/[^\d]/g, '');

    return digits !== '' && Number(digits) !== 0;
}

export function compactDocumentFields(fields = []) {
    return fields.filter((field) => hasBillingValue(field?.value));
}

export function formatDocumentAuthorizationLine(name, date) {
    const parts = [];

    if (hasBillingValue(name) && !isNumericId(name)) {
        parts.push(String(name).trim());
    }

    if (hasBillingValue(date)) {
        parts.push(formatBillingDocumentDate(date) || String(date).trim());
    }

    return parts.join(' · ');
}

export function buildDocumentAuthorization({
    preparedBy = '',
    preparedAt = '',
    approvedBy = '',
    approvedAt = '',
} = {}) {
    return {
        preparedBy,
        preparedAt,
        approvedBy,
        approvedAt,
    };
}

export function buildDocumentAuthorizationRows(authorization = {}) {
    const rows = [];
    const preparedLine = formatDocumentAuthorizationLine(
        authorization.preparedBy,
        authorization.preparedAt,
    );

    if (preparedLine) {
        rows.push({ label: 'Prepared by', value: preparedLine });
    }

    if (hasBillingValue(authorization.approvedBy) && !isNumericId(authorization.approvedBy)) {
        const approvedLine = formatDocumentAuthorizationLine(
            authorization.approvedBy,
            authorization.approvedAt,
        );

        if (approvedLine) {
            rows.push({ label: 'Approved by', value: approvedLine });
        }
    }

    return rows;
}

export function buildUtilityDocumentNote({ billingMonthLabel }) {
    if (!hasBillingValue(billingMonthLabel)) {
        return '';
    }

    return `This utility bill is for ${billingMonthLabel}.`;
}

export function buildInvoiceDocumentNote(state) {
    const parts = [];

    if (hasBillingValue(state.notes)) {
        parts.push(state.notes);
    }

    if (hasBillingValue(state.due_date)) {
        const dueDate = formatBillingDocumentDate(state.due_date) || state.due_date;
        parts.push(`Payment is due by ${dueDate}.`);
    }

    return parts.join(' ');
}

export function buildPaymentDocumentNote(state) {
    return hasBillingValue(state.note) ? state.note : '';
}

export function buildPaymentReferenceValue(state) {
    if (hasBillingValue(state.reference_number) && state.reference_number !== state.invoice_number) {
        return state.reference_number;
    }

    return '';
}
