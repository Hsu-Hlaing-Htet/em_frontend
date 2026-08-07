<template>
    <div v-if="!isLoading">
        <div class="mb-4 flex flex-wrap gap-2">
            <router-link :to="{ name: 'customerMaintenanceRequestList' }" class="flex-1">
                <Button label="Back" severity="secondary" class="customer-btn-block" />
            </router-link>
        </div>

        <div class="admin-panel p-4">
            <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p class="m-0 text-sm text-[var(--admin-text-muted)]">Maintenance Request</p>
                    <h1 class="customer-page-heading m-0">{{ state.title }}</h1>
                </div>
                <StatusBadge :value="state.status" />
            </div>

            <div class="customer-detail-grid">
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Building</p>
                    <p class="customer-detail-value">{{ state.building_name || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Room</p>
                    <p class="customer-detail-value">{{ state.room_number || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Category</p>
                    <p class="customer-detail-value capitalize">{{ state.category || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Priority</p>
                    <p class="customer-detail-value capitalize">{{ state.priority || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Submitted</p>
                    <p class="customer-detail-value">{{ state.created_at || '—' }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Updated</p>
                    <p class="customer-detail-value">{{ state.updated_at || '—' }}</p>
                </div>
                <div class="customer-detail-item md:col-span-2">
                    <p class="customer-detail-label">Description</p>
                    <p class="customer-detail-value leading-7">{{ state.description || '—' }}</p>
                </div>
                <div v-if="state.rejection_reason" class="customer-detail-item md:col-span-2">
                    <p class="customer-detail-label">Rejection Reason</p>
                    <p class="customer-detail-value leading-7">{{ state.rejection_reason }}</p>
                </div>
                <div v-if="state.resolution_note" class="customer-detail-item md:col-span-2">
                    <p class="customer-detail-label">Resolution Note</p>
                    <p class="customer-detail-value leading-7">{{ state.resolution_note }}</p>
                </div>
                <div v-if="state.approved_by_name" class="customer-detail-item">
                    <p class="customer-detail-label">Handled By</p>
                    <p class="customer-detail-value">{{ state.approved_by_name }}</p>
                </div>
                <div v-if="state.approved_at" class="customer-detail-item">
                    <p class="customer-detail-label">Handled At</p>
                    <p class="customer-detail-value">{{ state.approved_at }}</p>
                </div>
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import StatusBadge from '@/components/global/StatusBadge.vue';
import Loading from '@/components/global/Loading.vue';
import useCustomerShowMaintenanceRequest from '@/composables/customer/useCustomerShowMaintenanceRequest';

export default defineComponent({
    name: 'CustomerShowMaintenanceRequest',
    components: { Button, StatusBadge, Loading },
    setup() {
        return useCustomerShowMaintenanceRequest();
    },
});
</script>
