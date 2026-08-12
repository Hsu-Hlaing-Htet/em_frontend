<template>
    <div>
        <h1 class="customer-page-heading">{{ $t('customer.contracts') }}</h1>
        <p class="customer-page-lead">{{ $t('customer.contractsLead') }}</p>

        <Loading v-if="isLoading" />

        <div v-else-if="contracts.length" class="customer-list-stack">
            <CustomerTransactionCard
                v-for="contract in contracts"
                :key="contract.id"
                :transaction-id="contract.contract_number"
                :title="`${contract.type || $t('customer.contract')} · ${$t('customer.room')} ${contract.room_number || '—'}`"
                :amount="contract.contract_total"
                :subtitle="contract.building_name || '—'"
                :status="contract.status"
                :to="{ name: 'customerShowContract', params: { id: contract.id } }"
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
            icon="pi pi-home"
            :title="$t('customer.noContractsTitle')"
            :message="$t('customer.noContractsMessage')"
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
