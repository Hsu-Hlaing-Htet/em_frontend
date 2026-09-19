<template>
    <div class="min-h-full px-4 pb-8">
        <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="m-0 text-xl font-semibold">{{ pageTitle }}</h1>
                <p class="mt-1 mb-0 text-sm text-[var(--admin-text-muted)]">{{ pageSubtitle }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <router-link v-if="invoiceRoute" :to="invoiceRoute">
                    <Button label="View" icon="pi pi-eye" severity="secondary" />
                </router-link>
                <Button
                    v-if="canShowApprove()"
                    label="Approve"
                    icon="pi pi-check"
                    severity="success"
                    :loading="workflowLoading.approve"
                    :disabled="workflowLoading.approve || workflowLoading.reject || !canApprove()"
                    @click="showApproveDialog = true"
                />
                <Button
                    v-if="canReject()"
                    label="Reject"
                    icon="pi pi-times"
                    severity="danger"
                    outlined
                    :loading="workflowLoading.reject"
                    :disabled="workflowLoading.approve || workflowLoading.reject"
                    @click="showRejectDialog = true"
                />
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </div>

        <div v-if="!isLoading" class="mx-auto max-w-6xl">
            <PaymentDetailCard
                :mode="isApprovalView ? 'approval' : 'detail'"
                :payment-id="paymentId"
                :submitted-at="formattedCreatedAt"
                :status="paymentStatus"
                :show-status="isApprovalView"
                :invoice-number="state.invoice_number || invoiceSummary.invoice_number || '—'"
                :customer-name="state.customer_name || '—'"
                :building-name="state.building_name || '—'"
                :room-number="state.room_number || '—'"
                :payment-date="formattedPaymentDate"
                :payment-method="state.payment_method_name || '—'"
                :invoice-rows="invoiceRows"
                :sub-total="subTotalDisplay"
                :late-fee="lateFeeDisplay"
                :show-late-fee="showLateFee"
                :total="totalDisplay"
                received-label="Amount Received"
                :received="receivedDisplay"
                change-label="Change"
                :change="refundDisplay"
                :show-change="showChange"
                :balance="balanceDisplay"
                :proof-preview="proofPreview"
                :verified-by="state.approved_by_name || '—'"
                :verified-date="formattedVerifiedDate"
                :admin-remark-display="adminRemarkDisplay"
                v-model:admin-remark="adminRemark"
                :can-review="false"
                :approving="workflowLoading.approve"
                :rejecting="workflowLoading.reject"
                :approve-disabled="!canApprove()"
                @preview-proof="showProofPreview = true"
            />
        </div>

        <Dialog v-model:visible="showProofPreview" modal header="Payment Proof" class="w-full max-w-5xl">
            <img
                v-if="proofPreview"
                :src="proofPreview"
                alt="Payment proof full size"
                class="max-h-[80vh] w-full object-contain"
            >
        </Dialog>

        <ApproveRecordDialog
            v-model="showApproveDialog"
            entity="payment"
            :submitting="workflowLoading.approve"
            @confirm="runWorkflow('approve')"
        />
        <RejectContractDialog
            v-model="showRejectDialog"
            entity="payment"
            :submitting="workflowLoading.reject"
            :close-on-confirm="false"
            @confirm="runWorkflow('reject', { rejection_reason: $event })"
        />

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Loading from '@/components/global/Loading.vue';
import PaymentDetailCard from '@/components/admin/payments/PaymentDetailCard.vue';
import ApproveRecordDialog from '@/components/admin/ApproveRecordDialog.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import useShowPayment from './useShowPayment';

export default defineComponent({
    name: 'ShowPayment',
    components: {
        Button,
        Dialog,
        Loading,
        PaymentDetailCard,
        ApproveRecordDialog,
        RejectContractDialog,
    },
    setup() {
        return useShowPayment();
    },
});
</script>
