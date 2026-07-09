<template>
    <div class="flex flex-wrap items-center justify-between gap-3 p-4">
        <WorkflowActionBar
            :can-approve="canApprove()"
            :can-reject="canReject()"
            :approving="workflowLoading.approve"
            :rejecting="workflowLoading.reject"
            approve-label="Approve Payment"
            reject-label="Reject Payment"
            @approve="runWorkflow('approve')"
            @reject="runWorkflow('reject')"
        />
        <router-link :to="{ name: 'paymentList' }">
            <Button label="Back" />
        </router-link>
    </div>

    <div v-if="!isLoading" class="admin-panel mx-auto max-w-4xl">
        <div class="mb-4 flex items-center gap-3">
            <h2 class="m-0 text-lg font-semibold">Payment #{{ state.id }}</h2>
            <StatusBadge :value="state.status" />
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Invoice</p>
                <p class="text-sm">{{ state.invoice_id }}</p>
            </div>
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Method</p>
                <p class="text-sm">{{ state.payment_method_name || '—' }}</p>
            </div>
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Amount</p>
                <p class="text-sm font-medium">{{ state.amount }}</p>
            </div>
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Payment Date</p>
                <p class="text-sm">{{ state.payment_date }}</p>
            </div>
            <div class="p-3 md:col-span-2">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Note</p>
                <p class="text-sm">{{ state.note || '—' }}</p>
            </div>
        </div>

        <div class="mt-6">
            <h3 class="mb-3 text-md font-medium">Proof of Payment</h3>
            <div v-if="proofPreview" class="mb-4">
                <img :src="proofPreview" alt="Payment proof" class="max-h-80 rounded border border-[var(--admin-border)]">
            </div>
            <FileUpload
                mode="basic"
                choose-label="Upload Proof"
                accept="image/*"
                :auto="true"
                :disabled="isUploading"
                custom-upload
                @select="onProofSelect"
            />
        </div>
    </div>

    <Loading v-if="isLoading || isUploading" />
</template>

<script>
import { defineComponent } from 'vue';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import WorkflowActionBar from '@/components/admin/WorkflowActionBar.vue';
import useShowPayment from './useShowPayment';

export default defineComponent({
    name: 'ShowPayment',
    components: { FileUpload, Button, Loading, StatusBadge, WorkflowActionBar },
    setup() {
        return useShowPayment();
    },
});
</script>
