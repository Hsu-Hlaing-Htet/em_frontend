<template>
    <div>
        <h1 class="customer-page-heading">{{ $t('customer.invoices') }}</h1>
        <p class="customer-page-lead">{{ $t('customer.invoicesLead') }}</p>

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            :placeholder="$t('customer.invoiceSearchPlaceholder')"
            :filters="statusFilters"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="invoices.length" class="customer-list-stack">
            <CustomerTransactionCard
                v-for="invoice in invoices"
                :key="invoice.id"
                :transaction-id="invoice.invoice_number"
                :title="`${invoice.type || $t('customer.invoice')} · ${$t('customer.invoiceDue')} ${invoice.due_date || '—'}`"
                :amount="invoice.total_amount"
                :subtitle="`${$t('customer.paidAmount')} ${invoice.paid_amount ?? 0}`"
                :status="invoice.status"
                :to="{ name: 'customerShowInvoice', params: { id: invoice.id } }"
            />

            <Button
                v-if="hasMore()"
                :label="$t('common.loadMore')"
                class="customer-load-more customer-btn-primary"
                :loading="isLoadingMore"
                @click="loadMore"
            />
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
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import CustomerSearchBar from '@/components/customer/CustomerSearchBar.vue';
import CustomerTransactionCard from '@/components/customer/CustomerTransactionCard.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerInvoiceList from '@/composables/customer/useCustomerInvoiceList';

export default defineComponent({
    name: 'CustomerInvoiceList',
    components: {
        Button,
        Loading,
        CustomerSearchBar,
        CustomerTransactionCard,
        CustomerEmptyState,
    },
    setup() {
        return useCustomerInvoiceList();
    },
});
</script>
