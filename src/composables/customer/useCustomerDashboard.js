import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCustomerDashboardStore } from '@/modules/customer/dashboard/store';
import { showApiErrorToast } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatter';

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

export default function useCustomerDashboard() {
    const store = useCustomerDashboardStore();
    const router = useRouter();
    const { t } = useI18n();
    const isLoading = ref(true);
    const summary = ref({
        active_contracts: 0,
        completed_contracts: 0,
        unpaid_invoices: 0,
        paid_invoices: 0,
        total_payments: 0,
        pending_payments: 0,
        completed_payments: 0,
        total_paid_amount: 0,
    });
    const recentPayments = ref([]);

    const quickActions = computed(() => [
        { label: t('customer.payInvoice'), icon: 'pi pi-credit-card', to: '/customer/invoices' },
        { label: t('customer.paymentHistory'), icon: 'pi pi-history', to: '/customer/payments' },
        { label: t('customer.myReceipts'), icon: 'pi pi-receipt', to: '/customer/receipts' },
        { label: t('customer.myContracts'), icon: 'pi pi-home', to: '/customer/contracts' },
    ]);

    const statCards = computed(() => [
        { label: t('customer.totalPaid'), value: formatCurrency(summary.value.total_paid_amount), icon: 'pi pi-wallet' },
        { label: t('customer.pendingPayments'), value: summary.value.pending_payments, icon: 'pi pi-clock' },
        { label: t('customer.completedPayments'), value: summary.value.completed_payments, icon: 'pi pi-check-circle' },
        { label: t('customer.unpaidInvoices'), value: summary.value.unpaid_invoices, icon: 'pi pi-exclamation-circle' },
        { label: t('customer.paidInvoices'), value: summary.value.paid_invoices, icon: 'pi pi-file-check' },
        { label: t('customer.activeContracts'), value: summary.value.active_contracts, icon: 'pi pi-building' },
        { label: t('customer.pastContracts'), value: summary.value.completed_contracts, icon: 'pi pi-history' },
    ]);

    const openPayment = (payment) => {
        if (payment.invoice_id) {
            router.push({ name: 'customerShowInvoice', params: { id: payment.invoice_id } });
        }
    };

    onMounted(async () => {
        isLoading.value = true;

        try {
            await store.fetchDashboard();
            const data = store.getDashboardResponse?.data;

            if (data) {
                summary.value = {
                    active_contracts: data.active_contracts ?? 0,
                    completed_contracts: data.completed_contracts ?? 0,
                    unpaid_invoices: data.unpaid_invoices ?? 0,
                    paid_invoices: data.paid_invoices ?? 0,
                    total_payments: data.total_payments ?? 0,
                    pending_payments: data.pending_payments ?? 0,
                    completed_payments: data.completed_payments ?? 0,
                    total_paid_amount: data.total_paid_amount ?? 0,
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
        statCards,
        quickActions,
        openPayment,
    };
}
