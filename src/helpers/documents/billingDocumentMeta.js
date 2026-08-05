import { hasBillingValue } from '@/helpers/billing/billingDetailHelpers';

export function getBillingDocumentMeta(document, referenceLabel) {
    return [
        { label: referenceLabel, value: document?.header?.referenceNo },
        { label: 'Issue Date', value: document?.header?.issuedDate },
    ].filter((item) => hasBillingValue(item.value));
}
