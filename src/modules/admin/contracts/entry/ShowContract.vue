<template>
    <div class="flex flex-wrap items-center justify-between gap-3 p-4">
        <WorkflowActionBar
            :can-submit="canSubmit()"
            :can-approve="canApprove()"
            :can-reject="canReject()"
            :submitting="workflowLoading.submit"
            :approving="workflowLoading.approve"
            :rejecting="workflowLoading.reject"
            @submit="runWorkflow('submit')"
            @approve="runWorkflow('approve')"
            @reject="runWorkflow('reject')"
        />
        <div class="flex gap-2">
            <router-link :to="{ name: 'contractList' }">
                <Button label="Back" />
            </router-link>
            <router-link v-if="state.id && state.status === 'draft'" :to="{ name: 'editContract', params: { id: state.id } }">
                <Button icon="pi pi-pencil" text severity="info" />
            </router-link>
        </div>
    </div>

    <div v-if="!isLoading" class="admin-panel mx-auto max-w-5xl">
        <div class="mb-4 flex items-center gap-3">
            <h2 class="m-0 text-lg font-semibold">{{ state.contract_number }}</h2>
            <StatusBadge :value="state.status" />
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Customer</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.user_name || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Room</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.room_number || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Payment Plan</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.payment_plan_name || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Type / Payment</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.type }} / {{ state.payment_type }}</p>
            </div>
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Contract Total</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.contract_total || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Duration</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.duration_months ? `${state.duration_months} months` : '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Start Date</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.start_date || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">End Date</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.end_date || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Billing Day</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.billing_day || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Approved At</p>
                <p class="text-sm text-[var(--admin-text)]">{{ state.approved_at || '—' }}</p>
            </div>
            <div class="p-3 md:col-span-2">
                <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">Remark</p>
                <p class="text-sm leading-7 text-[var(--admin-text)]">{{ state.remark || '—' }}</p>
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
import WorkflowActionBar from '@/components/admin/WorkflowActionBar.vue';
import useShowContract from './useShowContract';

export default defineComponent({
    name: 'ShowContract',
    components: { Button, Loading, StatusBadge, WorkflowActionBar },
    setup() {
        return useShowContract();
    },
});
</script>
