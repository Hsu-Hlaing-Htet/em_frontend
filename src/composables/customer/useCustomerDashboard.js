import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/modules/auth/store';
import { useCustomerDashboardStore } from '@/modules/customer/dashboard/store';
import { service } from '@/modules/customer/service';
import { showApiErrorToast } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatter';

const OPEN_INVOICE_STATUSES = new Set(['issued', 'partial', 'overdue', 'unpaid']);

function cloneRows(rows) {
    return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

function toTimestamp(value) {
    if (!value) {
        return Number.POSITIVE_INFINITY;
    }

    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

export default function useCustomerDashboard() {
    const authStore = useAuthStore();
    const dashboardStore = useCustomerDashboardStore();
    const router = useRouter();
    const { t, locale } = useI18n();
    const { user } = storeToRefs(authStore);
    const isLoading = ref(true);
    const summary = ref({
        active_contracts: 0,
        completed_contracts: 0,
        unpaid_invoices: 0,
        paid_invoices: 0,
        total_paid_amount: 0,
    });
    const recentPayments = ref([]);
    const invoices = ref([]);
    const latestNotifications = ref([]);
    const openMaintenance = ref(0);

    const customerName = computed(() => user.value?.name || t('customer.customerFallback'));

    const openInvoices = computed(() => invoices.value.filter((invoice) => OPEN_INVOICE_STATUSES.has(invoice.status)));

    const outstandingBalance = computed(() => openInvoices.value.reduce(
        (total, invoice) => total + Number(invoice.remaining_balance ?? invoice.total_amount ?? 0),
        0,
    ));

    const nextInvoice = computed(() => [...openInvoices.value]
        .filter((invoice) => invoice.due_date)
        .sort((left, right) => toTimestamp(left.due_date) - toTimestamp(right.due_date))[0] || null);

    const formatMoney = (value) => formatCurrency(Number(value || 0));

    const formatDisplayDate = (value) => {
        if (!value) {
            return '—';
        }

        const date = new Date(`${value}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat(locale.value === 'my' ? 'my-MM' : 'en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    const formatDisplayDateTime = (value) => {
        if (!value) {
            return '—';
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat(locale.value === 'my' ? 'my-MM' : 'en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const primaryCards = computed(() => [
        {
            key: 'balance',
            label: t('customer.outstandingBalance'),
            value: formatMoney(outstandingBalance.value),
            detail: openInvoices.value.length
                ? t('customer.acrossOpenInvoices', { count: openInvoices.value.length })
                : t('customer.noOutstandingBalance'),
            icon: 'pi pi-wallet',
            tone: 'burgundy',
            to: '/customer/invoices',
            action: t('customer.viewInvoices'),
        },
        {
            key: 'next-payment',
            label: t('customer.nextPaymentDue'),
            value: nextInvoice.value ? formatDisplayDate(nextInvoice.value.due_date) : t('customer.noneDue'),
            detail: nextInvoice.value
                ? `${nextInvoice.value.invoice_number} · ${formatMoney(nextInvoice.value.remaining_balance ?? nextInvoice.value.total_amount)}`
                : t('customer.noOpenInvoices'),
            icon: 'pi pi-calendar',
            tone: 'gold',
            to: nextInvoice.value ? `/customer/invoices/${nextInvoice.value.id}` : '/customer/invoices',
            action: nextInvoice.value ? t('customer.viewInvoice') : t('customer.viewInvoices'),
        },
        {
            key: 'contract',
            label: t('customer.activeContract'),
            value: summary.value.active_contracts,
            detail: summary.value.active_contracts ? t('customer.currentAgreements') : t('customer.noActiveContracts'),
            icon: 'pi pi-home',
            tone: 'neutral',
            to: '/customer/contracts',
            action: t('customer.viewContracts'),
        },
        {
            key: 'maintenance',
            label: t('customer.openMaintenance'),
            value: openMaintenance.value,
            detail: openMaintenance.value ? t('customer.requestsInProgress') : t('customer.noOpenMaintenance'),
            icon: 'pi pi-wrench',
            tone: 'green',
            to: '/customer/maintenance-requests',
            action: t('customer.viewRequests'),
        },
    ]);

    const secondaryCards = computed(() => [
        { key: 'unpaid', label: t('customer.unpaidInvoices'), value: summary.value.unpaid_invoices, icon: 'pi pi-file' },
        { key: 'paid', label: t('customer.paidInvoices'), value: summary.value.paid_invoices, icon: 'pi pi-check-circle' },
        { key: 'total-paid', label: t('customer.totalPaid'), value: formatMoney(summary.value.total_paid_amount), icon: 'pi pi-credit-card' },
        { key: 'past-contracts', label: t('customer.pastContracts'), value: summary.value.completed_contracts, icon: 'pi pi-history' },
    ]);

    const openPayment = (payment) => {
        if (payment.invoice_id) {
            router.push({ name: 'customerShowInvoice', params: { id: payment.invoice_id } });
        }
    };

    const openNotification = (item) => {
        const routeByType = {
            invoice: 'customerShowInvoice',
            payment: 'customerShowInvoice',
            receipt: 'customerShowReceipt',
            contract: 'customerShowContract',
        };
        const routeName = routeByType[item.type];

        if (routeName && item.resource_id) {
            router.push({ name: routeName, params: { id: item.resource_id } });
        }
    };

    const notificationIcon = (type) => ({
        invoice: 'pi pi-file',
        payment: 'pi pi-wallet',
        receipt: 'pi pi-receipt',
        contract: 'pi pi-home',
    }[type] || 'pi pi-bell');

    onMounted(async () => {
        isLoading.value = true;

        try {
            const results = await Promise.allSettled([
                dashboardStore.fetchDashboard().then(() => dashboardStore.getDashboardResponse),
                service.getInvoices({ page: 1, per_page: 1000 }),
                service.getMaintenanceRequests({ page: 1, per_page: 1, status: 'pending' }),
                service.getMaintenanceRequests({ page: 1, per_page: 1, status: 'in_progress' }),
                service.getNotifications(),
            ]);

            const values = results.map((result) => result.status === 'fulfilled' ? result.value : null);
            const [dashboardResponse, invoiceResponse, pendingResponse, inProgressResponse, notificationResponse] = values;

            const data = dashboardResponse?.data;
            if (data) {
                summary.value = {
                    active_contracts: data.active_contracts ?? 0,
                    completed_contracts: data.completed_contracts ?? 0,
                    unpaid_invoices: data.unpaid_invoices ?? 0,
                    paid_invoices: data.paid_invoices ?? 0,
                    total_paid_amount: data.total_paid_amount ?? 0,
                };
                recentPayments.value = cloneRows(data.recent_payments);
            }

            invoices.value = cloneRows(invoiceResponse?.data?.data);
            openMaintenance.value = Number(pendingResponse?.data?.total || 0)
                + Number(inProgressResponse?.data?.total || 0);
            latestNotifications.value = cloneRows(notificationResponse?.data).slice(0, 5);

            const failedRequest = results.find((result) => result.status === 'rejected');
            if (failedRequest) {
                showApiErrorToast(failedRequest.reason, 'Some dashboard information could not be loaded.');
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load dashboard.');
        } finally {
            isLoading.value = false;
        }
    });

    return {
        isLoading,
        customerName,
        recentPayments,
        latestNotifications,
        primaryCards,
        secondaryCards,
        formatMoney,
        formatDisplayDate,
        formatDisplayDateTime,
        notificationIcon,
        openPayment,
        openNotification,
    };
}
