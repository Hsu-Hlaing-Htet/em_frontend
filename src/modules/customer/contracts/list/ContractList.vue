<template>
    <div>
        <h1 class="customer-page-heading">Contracts</h1>
        <p class="customer-page-lead">Your active and past property agreements</p>

        <Loading v-if="isLoading" />

        <div v-else-if="contracts.length" class="customer-list-stack">
            <CustomerTransactionCard
                v-for="contract in contracts"
                :key="contract.id"
                :transaction-id="contract.contract_number"
                :title="`${contract.type || 'Contract'} · Room ${contract.room_number || '—'}`"
                :amount="contract.contract_total"
                :subtitle="contract.building_name || '—'"
                :status="contract.status"
                :to="{ name: 'customerShowContract', params: { id: contract.id } }"
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
            icon="pi pi-home"
            title="No contracts found"
            message="Your approved and completed contracts will appear here."
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import CustomerTransactionCard from '@/components/customer/CustomerTransactionCard.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import useCustomerContractList from '@/composables/customer/useCustomerContractList';

export default defineComponent({
    name: 'CustomerContractList',
    components: {
        Button,
        Loading,
        CustomerTransactionCard,
        CustomerEmptyState,
    },
    setup() {
        return useCustomerContractList();
    },
});
</script>
