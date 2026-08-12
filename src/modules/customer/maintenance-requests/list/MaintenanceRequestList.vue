<template>
    <div>
        <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="customer-page-heading">{{ $t('customer.maintenance') }}</h1>
                <p class="customer-page-lead">{{ $t('customer.maintenanceLead') }}</p>
            </div>
            <router-link :to="{ name: 'customerNewMaintenanceRequest' }">
                <Button :label="$t('customer.newRequest')" icon="pi pi-plus" />
            </router-link>
        </div>

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            :placeholder="$t('customer.maintenanceSearchPlaceholder')"
            :filters="statusFilters"
        />

        <Loading v-if="isLoading" />

        <div v-else-if="requests.length" class="customer-list-stack">
            <CustomerTransactionCard
                v-for="request in requests"
                :key="request.id"
                :transaction-id="`#${request.id}`"
                :title="request.title"
                :amount="null"
                :subtitle="`${request.building_name || $t('customer.room')} · ${request.room_number || '—'} · ${request.category || 'general'} · ${request.priority || 'medium'}`"
                :status="request.status"
                :to="{ name: 'customerShowMaintenanceRequest', params: { id: request.id } }"
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
            icon="pi pi-wrench"
            :title="$t('customer.noMaintenanceTitle')"
            :message="$t('customer.noMaintenanceMessage')"
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
import useCustomerMaintenanceRequestList from '@/composables/customer/useCustomerMaintenanceRequestList';

export default defineComponent({
    name: 'CustomerMaintenanceRequestList',
    components: {
        Button,
        Loading,
        CustomerSearchBar,
        CustomerTransactionCard,
        CustomerEmptyState,
    },
    setup() {
        return useCustomerMaintenanceRequestList();
    },
});
</script>
