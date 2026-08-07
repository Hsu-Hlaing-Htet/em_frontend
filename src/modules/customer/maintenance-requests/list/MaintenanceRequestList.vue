<template>
    <div>
        <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="customer-page-heading">Maintenance</h1>
                <p class="customer-page-lead">Track repair requests for your rooms</p>
            </div>
            <router-link :to="{ name: 'customerNewMaintenanceRequest' }">
                <Button label="New Request" icon="pi pi-plus" />
            </router-link>
        </div>

        <CustomerSearchBar
            v-model:search="search"
            v-model:status="status"
            placeholder="Search by title, room, or category"
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
                :subtitle="`${request.building_name || 'Room'} · ${request.room_number || '—'} · ${request.category || 'general'} · ${request.priority || 'medium'}`"
                :status="request.status"
                :to="{ name: 'customerShowMaintenanceRequest', params: { id: request.id } }"
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
            icon="pi pi-wrench"
            title="No maintenance requests"
            message="Submit a request when something needs attention in your room."
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
