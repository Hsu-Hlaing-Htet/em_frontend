import { onMounted, ref } from 'vue';
import { useCustomerDashboardStore } from '@/modules/customer/dashboard/store';
import { showApiErrorToast } from '@/utils/apiError';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

export default function useCustomerDashboard() {
    const store = useCustomerDashboardStore();
    const isLoading = ref(true);
    const summary = ref({
        active_contracts: 0,
        unpaid_invoices: 0,
        paid_invoices: 0,
    });
    const recentPayments = ref([]);

    onMounted(async () => {
        isLoading.value = true;

        try {
            await store.fetchDashboard();
            const data = store.getDashboardResponse?.data;

            if (data) {
                summary.value = {
                    active_contracts: data.active_contracts ?? 0,
                    unpaid_invoices: data.unpaid_invoices ?? 0,
                    paid_invoices: data.paid_invoices ?? 0,
                };
                recentPayments.value = cloneRows(data.recent_payments);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load dashboard.');
        } finally {
            isLoading.value = false;
        }
    });

    return {
        isLoading,
        summary,
        recentPayments,
    };
}
