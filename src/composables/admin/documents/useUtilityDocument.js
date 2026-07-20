import { computed } from 'vue';
import {
    formatBillingMonthLabel,
    formatCurrency,
    formatReading,
    formatUtilityReference,
    getStatusLabel,
} from '@/helpers/documents/billingDocumentHelpers';

export function useUtilityDocument(state) {
    const document = computed(() => ({
        header: {
            referenceNo: formatUtilityReference(state),
            issuedDate: state.approved_at || state.created_at || '-',
        },
        details: [
            { label: 'Customer', value: state.customer_name },
            { label: 'Building', value: state.building_name },
            { label: 'Room / Unit', value: state.room_number },
            { label: 'Billing Month', value: formatBillingMonthLabel(state.billing_month) },
            { label: 'Status', value: getStatusLabel(state.status) },
            { label: 'Prepared By', value: state.created_by_name },
            { label: 'Approved By', value: state.approved_by_name || 'Pending' },
        ],
        readings: (state.items || []).map((item) => ({
            utility_type: item.utility_type_name || '-',
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
