<template>
    <div>
        <h1 class="customer-page-heading">Invoices</h1>
        <p class="customer-page-lead">View bills and make payments</p>

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            placeholder="Search by invoice number or type"
            :filters="statusFilters"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="invoices.length" class="customer-list-stack">
            <CustomerTransactionCard
                v-for="invoice in invoices"
                :key="invoice.id"
                :transaction-id="invoice.invoice_number"
                :title="`${invoice.type || 'Invoice'} · Due ${invoice.due_date || '—'}`"
                :amount="invoice.total_amount"
                :subtitle="`Paid ${invoice.paid_amount ?? 0}`"
                :status="invoice.status"
                :to="{ name: 'customerShowInvoice', params: { id: invoice.id } }"
            />

            <Button
                v-if="hasMore()"
                label="Load more"
                class="customer-load-more customer-btn-primary"
                :loading="isLoadingMore"
                @click="loadMore"
            />
        </div>

        <CustomerEmptyState
            v-else
            icon="pi pi-file"
            title="No invoices found"
            message="Try changing your search or filter."
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
