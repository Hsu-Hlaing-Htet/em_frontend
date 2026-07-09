<template>
    <div class="flex flex-wrap items-center justify-between gap-3 p-4">
        <div class="flex flex-wrap gap-2" role="toolbar" aria-label="Maintenance workflow actions">
            <Button
                v-if="canStart()"
                type="button"
                label="Start"
                icon="pi pi-play"
                :loading="workflowLoading.start"
                :disabled="workflowLoading.complete || workflowLoading.reject"
                @click="runWorkflow('start')"
            />
            <Button
                v-if="canComplete()"
                type="button"
                label="Complete"
                icon="pi pi-check"
                severity="success"
                :loading="workflowLoading.complete"
                :disabled="workflowLoading.start || workflowLoading.reject"
                @click="runWorkflow('complete')"
            />
            <Button
                v-if="canReject()"
                type="button"
                label="Reject"
                icon="pi pi-times"
                severity="danger"
                outlined
                :loading="workflowLoading.reject"
                :disabled="workflowLoading.start || workflowLoading.complete"
                @click="runWorkflow('reject')"
            />
        </div>
        <div class="flex gap-2">
            <router-link :to="{ name: 'maintenanceRequestList' }">
                <Button label="Back" />
            </router-link>
            <router-link v-if="state.status === 'pending'" :to="{ name: 'editMaintenanceRequest', params: { id: state.id } }">
                <Button icon="pi pi-pencil" text severity="info" />
            </router-link>
        </div>
    </div>

    <div v-if="!isLoading" class="admin-panel mx-auto max-w-4xl">
        <div class="mb-4 flex items-center gap-3">
            <h2 class="m-0 text-lg font-semibold">{{ state.title }}</h2>
            <StatusBadge :value="state.status" />
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Room</p>
                <p class="text-sm">{{ state.room_number || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Resident</p>
                <p class="text-sm">{{ state.user_name || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Created</p>
                <p class="text-sm">{{ state.created_at }}</p>
            </div>
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Completed At</p>
                <p class="text-sm">{{ state.approved_at || '—' }}</p>
            </div>
            <div class="p-3 md:col-span-2">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Description</p>
                <p class="text-sm leading-7">{{ state.description || '—' }}</p>
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import useShowMaintenanceRequest from './useShowMaintenanceRequest';

export default defineComponent({
    name: 'ShowMaintenanceRequest',
    components: { Button, Loading, StatusBadge },
    setup() {
        return useShowMaintenanceRequest();
    },
});
</script>
