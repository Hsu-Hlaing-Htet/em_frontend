import {
    formatBillingDocumentDate,
    hasBillingValue,
} from '@/helpers/billing/billingDetailHelpers';
import { parseDate, formatDate } from '@/utils/formatter';

function pushRow(rows, label, value) {
    if (!hasBillingValue(value)) {
        return;
    }

    rows.push({ label, value });
}

function extractDurationMonths(value) {
    if (!hasBillingValue(value)) {
        return null;
    }

    const match = String(value).match(/(\d+)/);

    return match ? Number(match[1]) : null;
}

function isNumericId(value) {
    return /^\d+$/.test(String(value ?? '').trim());
}

function isMeaningfulCurrencyValue(value) {
    if (!hasBillingValue(value)) {
        return false;
    }

    const digits = String(value).replace(/[^\d]/g, '');

    return digits !== '' && Number(digits) !== 0;
}

function findFieldValue(items = [], label) {
    return items.find((item) => item.label === label)?.value;
}

function computeLeaseEndDate(startDate, durationMonths) {
    if (!hasBillingValue(startDate) || !durationMonths) {
        return '';
    }

    const parsed = parseDate(String(startDate).slice(0, 10));

    if (!parsed || Number.isNaN(parsed.getTime())) {
        return '';
    }

    const end = new Date(parsed);
    end.setMonth(end.getMonth() + Number(durationMonths));
    end.setDate(end.getDate() - 1);

    return formatDate(end);
}

export function compactContractRows(rows = []) {
    return rows.filter((row) => hasBillingValue(row?.value));
}

function formatAuthorizationLine(name, date) {
    const parts = [];

    if (hasBillingValue(name) && !isNumericId(name)) {
        parts.push(String(name).trim());
    }

    if (hasBillingValue(date)) {
        parts.push(formatBillingDocumentDate(date) || String(date).trim());
    }

    return parts.join(' · ');
}

export function buildDocumentAuthorizationRows(document) {
    const auth = document?.authorization || {};
    const rows = [];

    const preparedLine = formatAuthorizationLine(auth.preparedBy, auth.preparedAt);

    if (preparedLine) {
        rows.push({ label: 'Prepared by', value: preparedLine });
    }

    if (hasBillingValue(auth.approvedBy) && !isNumericId(auth.approvedBy)) {
        const approvedLine = formatAuthorizationLine(auth.approvedBy, auth.approvedAt);

        if (approvedLine) {
            rows.push({ label: 'Approved by', value: approvedLine });
        }
    }

    return rows;
}

export function buildPropertyLocationRows(document) {
    const building = document.property?.find((item) => item.label === 'Building');
    const unit = document.property?.find((item) => item.label === 'Room / Unit');
    const address = document.customer?.find((item) => item.label === 'Address');

    return compactContractRows([
        building && { label: 'Residence', value: building.value },
        unit && { label: 'Unit', value: unit.value },
        address && { label: 'Address', value: address.value },
    ].filter(Boolean));
}

export function buildFinancialRows(document, variant = {}) {
    const property = document.property || [];
    const contract = document.contract || [];
    const isRent = variant.kind === 'rent'
        || property.some((item) => item.label === 'Rent Price');

    const priceLabel = isRent ? 'Rent Price' : 'Sale Price';
    const depositLabel = isRent ? 'Security Deposit' : 'Booking Deposit';

    const priceValue = findFieldValue(property, priceLabel);
    const depositValue = findFieldValue(property, depositLabel);

    const leaseStart = findFieldValue(contract, 'Commencement Date');
    const durationValue = findFieldValue(contract, 'Contract Duration')
        || findFieldValue(contract, 'Duration')
        || (document.installment?.duration ?? '');
    const durationMonths = extractDurationMonths(durationValue);
    const leaseEnd = computeLeaseEndDate(leaseStart, durationMonths);

    const billingDay = findFieldValue(contract, 'Billing Day');
    const paymentPlan = findFieldValue(contract, 'Payment Plan');
    const paymentMethod = findFieldValue(contract, 'Payment Type');
    const contractTotal = findFieldValue(contract, 'Contract Total');

    const rows = [];

    pushRow(rows, priceLabel, priceValue);
    pushRow(rows, depositLabel, depositValue);

    if (isRent) {
        pushRow(rows, 'Lease Start', leaseStart);
        pushRow(rows, 'Lease End', leaseEnd);
    } else {
        pushRow(rows, 'Commencement Date', leaseStart);
        pushRow(rows, 'End Date', leaseEnd);
    }

    pushRow(rows, 'Duration', durationValue);
    pushRow(rows, 'Payment Due Day', billingDay);
    pushRow(rows, 'Payment Plan', paymentPlan);
    pushRow(rows, 'Payment Method', paymentMethod);

    if (isMeaningfulCurrencyValue(contractTotal)) {
        pushRow(rows, 'Total', contractTotal);
    }

    return rows;
}
