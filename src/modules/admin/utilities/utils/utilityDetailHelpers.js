export {
    formatBillingDocumentDate,
    formatBillingDocumentDate as formatUtilityDocumentDate,
    hasBillingValue,
    compactBillingValues,
} from '@/helpers/billing/billingDetailHelpers';

export const formatUtilitySummaryNote = ({
    billingMonthLabel,
    createdAtLabel,
    createdByName,
    approvedByName,
    status,
}) => {
    const parts = [];

    if (billingMonthLabel && billingMonthLabel !== '—' && billingMonthLabel !== '-') {
        parts.push(`This Utility is for the month of ${billingMonthLabel}`);
    }

    if (createdAtLabel) {
        parts.push(`created on ${createdAtLabel}`);
    }

    if (createdByName) {
        parts.push(`by ${createdByName}`);
    }

    if (status === 'approved' && approvedByName) {
        parts.push(`approved by ${approvedByName}`);
    } else if (status === 'rejected' && approvedByName) {
        parts.push(`rejected by ${approvedByName}`);
    }

    if (!parts.length) {
        return '';
    }

    const [first, ...rest] = parts;

    if (!rest.length) {
        return `${first}.`;
    }

    return `${first} and was ${rest.join(' and ')}.`;
};
