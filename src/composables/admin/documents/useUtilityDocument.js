import { computed } from 'vue';
import {
    formatBillingMonthLabel,
    formatCurrency,
    formatReading,
    formatUtilityReference,
} from '@/helpers/documents/billingDocumentHelpers';
import { hasBillingValue } from '@/helpers/billing/billingDetailHelpers';
import {
    formatUtilityDocumentDate,
    formatUtilitySummaryNote,
} from '@/modules/admin/utilities/utils/utilityDetailHelpers';

export function useUtilityDocument(state) {
    const formattedBillingMonth = computed(() => formatBillingMonthLabel(state.billing_month));
    const formattedCreatedAt = computed(() => formatUtilityDocumentDate(state.created_at));

    const document = computed(() => ({
        header: {
            referenceNo: formatUtilityReference(state),
            issuedDate: state.approved_at || state.created_at || '-',
        },
        customerInfo: {
            name: state.customer_name,
            address: state.customer_address,
            phone: state.customer_phone,
            email: state.customer_email,
            building: state.building_name,
            room: state.room_number,
            issuedDate: formatUtilityDocumentDate(state.approved_at || state.created_at),
        },
        summaryNote: formatUtilitySummaryNote({
            billingMonthLabel: formattedBillingMonth.value,
            createdAtLabel: formattedCreatedAt.value,
            createdByName: state.created_by_name,
            approvedByName: state.approved_by_name,
        }),
        readings: (state.items || []).map((item) => ({
            utility_type: item.utility_type_name || '',
            previous_reading: formatReading(item.previous_reading),
            current_reading: formatReading(item.current_reading),
            usage: formatReading(item.usage),
            unit_price: formatCurrency(item.unit_price),
            amount: formatCurrency(item.amount),
        })),
        totalDue: {
            label: 'Total Amount',
            amount: formatCurrency(state.total_amount),
        },
    }));

    return { document };
}

export function buildUtilityCustomerLines(state) {
    return [
        state.customer_address,
        state.customer_phone,
        state.customer_email,
        state.building_name,
        state.room_number,
    ].filter((value) => hasBillingValue(value));
}
