<template>
    <div class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.invoices')"
            :subtitle="$t('customer.invoicesLead')"
        />

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            class="customer-list-toolbar customer-invoice-toolbar"
            :placeholder="$t('customer.invoiceSearchPlaceholder')"
            :filters="statusFilters"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="invoices.length" class="customer-record-list">
            <router-link
                v-for="invoice in invoices"
                :key="invoice.id"
                :to="{ name: 'customerInvoiceDocument', params: { id: invoice.id } }"
                class="customer-record-row customer-invoice-row"
            >
                <span class="customer-record-cell customer-record-primary">
                    <span class="customer-record-label">{{ invoice.type || $t('customer.invoice') }}</span>
                    <strong>{{ invoice.invoice_number || '—' }}</strong>
                    <small>{{ $t('customer.amount') }} (MMK) {{ formatCurrency(Number(invoice.total_amount || 0)) }}</small>
                </span>
                <span class="customer-record-cell customer-record-meta">
                    <span class="customer-record-label">{{ $t('customer.dueDate') }}</span>
                    <strong>{{ invoice.due_date || '—' }}</strong>
                    <small>{{ invoice.billing_period || '—' }}</small>
                    <StatusBadge :value="invoice.status" />
                </span>
            </router-link>
        </div>

        <CustomerEmptyState
            v-else
            icon="pi pi-file"
            :title="$t('customer.noInvoicesTitle')"
            :message="$t('customer.noInvoicesMessage')"
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerSearchBar from '@/components/customer/CustomerSearchBar.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerInvoiceList from '@/composables/customer/useCustomerInvoiceList';
import { formatCurrencyAmount as formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerInvoiceList',
    components: {
        Loading,
        StatusBadge,
        CustomerSearchBar,
        CustomerEmptyState,
        CustomerPageHeader,
    },
    setup() {
        return { ...useCustomerInvoiceList(), formatCurrency };
    },
});
</script>
