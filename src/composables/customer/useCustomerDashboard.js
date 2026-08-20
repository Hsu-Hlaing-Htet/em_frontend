import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/modules/auth/store';
import { service } from '@/modules/customer/service';
import { showApiErrorToast } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatter';
import { useCustomerNotificationStore } from '@/modules/customer/notifications/store';
import {
    customerNotificationIcon,
    customerNotificationRoute,
    customerNotificationTone,
    formatContractTypeLabel,
    formatPropertyLabel,
    formatRelativeTime,
    invoiceDueStatus,
    isCustomerNotificationUnread,
} from '@/helpers/customer/notifications';

const OPEN_INVOICE_STATUSES = new Set(['issued', 'partial', 'overdue', 'unpaid']);
const ACTIVE_CONTRACT_STATUSES = new Set(['approved', 'active']);

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
    const router = useRouter();
    const { t, locale } = useI18n();
    const { user } = storeToRefs(authStore);
    const notificationStore = useCustomerNotificationStore();

    const isLoading = ref(true);
    const activeContracts = ref([]);
    const invoices = ref([]);

    const customerName = computed(() => user.value?.name?.trim() || '');

    const openInvoices = computed(() => invoices.value.filter((invoice) => OPEN_INVOICE_STATUSES.has(invoice.status)));

    const outstandingBalance = computed(() => openInvoices.value.reduce(
        (total, invoice) => total + Number(invoice.remaining_balance ?? invoice.total_amount ?? 0),
        0,
    ));

    const overdueInvoices = computed(() => [...openInvoices.value]
        .filter((invoice) => invoiceDueStatus(invoice).badgeValue === 'overdue')
        .sort((left, right) => toTimestamp(left.due_date) - toTimestamp(right.due_date)));

    const overdueTotal = computed(() => overdueInvoices.value.reduce(
        (total, invoice) => total + Number(invoice.remaining_balance ?? invoice.total_amount ?? 0),
        0,
    ));

    const primaryActiveContract = computed(() => activeContracts.value[0] || null);
    const contractListRoute = { name: 'customerContractList' };

    const hasMultipleContracts = computed(() => activeContracts.value.length > 1);

    const latestNotifications = computed(() => notificationStore.latestNotifications);

    const quickActions = computed(() => [
        {
            key: 'invoices',
            title: t('customer.invoices'),
            description: t('customer.quickActionInvoices'),
            icon: 'pi pi-file',
            tone: 'tone-gold',
            to: { name: 'customerInvoiceList' },
            action: t('customer.viewInvoicesAction'),
        },
        {
            key: 'payments',
            title: t('customer.payments'),
            description: t('customer.quickActionPayments'),
            icon: 'pi pi-wallet',
            tone: 'tone-green',
            to: { name: 'customerPaymentList' },
            action: t('customer.viewPaymentsAction'),
        },
        {
            key: 'receipts',
            title: t('customer.receipts'),
            description: t('customer.quickActionReceipts'),
            icon: 'pi pi-receipt',
            tone: 'tone-purple',
            to: { name: 'customerReceiptList' },
            action: t('customer.viewReceiptsAction'),
        },
        {
            key: 'maintenance',
            title: t('customer.maintenance'),
            description: t('customer.quickActionMaintenance'),
            icon: 'pi pi-wrench',
            tone: 'tone-blue',
            to: { name: 'customerMaintenanceRequestList' },
            action: t('customer.viewRequestsAction'),
        },
    ]);

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

    const formatDisplayDateTime = (value) => formatRelativeTime(value, locale.value === 'my' ? 'my-MM' : 'en-GB');

    const openNotification = (item) => {
        const target = customerNotificationRoute(item);

        if (!target) {
            return;
        }

        notificationStore.markAsRead(item?.id);
        router.push(target);
    };

    const openInvoice = (invoiceId) => {
        if (invoiceId) {
            router.push({ name: 'customerShowInvoice', params: { id: invoiceId } });
        }
    };

    onMounted(async () => {
        isLoading.value = true;

        try {
            const results = await Promise.allSettled([
                service.getContracts({ page: 1, per_page: 20, status: 'active' }),
                service.getContracts({ page: 1, per_page: 20, status: 'approved' }),
                service.getInvoices({ page: 1, per_page: 1000 }),
            ]);

            const [activeResponse, approvedResponse, invoiceResponse] = results.map(
                (result) => (result.status === 'fulfilled' ? result.value : null),
            );

            const contractRows = [
                ...cloneRows(activeResponse?.data?.data),
                ...cloneRows(approvedResponse?.data?.data),
            ].filter((contract, index, rows) => (
                ACTIVE_CONTRACT_STATUSES.has(contract.status)
                && rows.findIndex((row) => row.id === contract.id) === index
            ));

            activeContracts.value = contractRows;
            invoices.value = cloneRows(invoiceResponse?.data?.data);

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
        activeContracts,
        primaryActiveContract,
        contractListRoute,
        hasMultipleContracts,
        latestNotifications,
        overdueInvoices,
        overdueTotal,
        outstandingBalance,
        quickActions,
        formatMoney,
        formatDisplayDate,
        formatDisplayDateTime,
        formatContractTypeLabel,
        formatPropertyLabel,
        notificationIcon: customerNotificationIcon,
        notificationTone: customerNotificationTone,
        isNotificationUnread: isCustomerNotificationUnread,
        openNotification,
        openInvoice,
    };
}
