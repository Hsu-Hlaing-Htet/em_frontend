<template>
    <div class="min-h-full">
        <div class="mb-10 flex flex-wrap items-end justify-end gap-2">
            <WorkflowActionBar
                :can-approve="canShowApprove()"
                :approve-disabled="!canApprove()"
                :can-reject="canReject()"
                :approving="workflowLoading.approve"
                :rejecting="workflowLoading.reject"
                approve-label="Approve"
                reject-label="Reject"
                confirm-approve-message="Approve this payment and create a draft receipt?"
                confirm-reject-message="Reject this payment?"
                @approve="runWorkflow('approve')"
                @reject="openRejectDialog"
            />
            <router-link
                v-if="invoiceRoute"
                :to="invoiceRoute"
            >
                <Button
                    icon="pi pi-file"
                    label="View Invoice"
                    severity="secondary"
                />
            </router-link>
            <router-link
                v-if="receiptRoute"
                :to="receiptRoute"
            >
                <Button
                    icon="pi pi-receipt"
                    label="View Receipt"
                    severity="secondary"
                />
            </router-link>
            <router-link :to="backRoute">
                <Button label="Back" />
            </router-link>
        </div>

        <div v-if="!isLoading" class="mx-auto flex max-w-7xl flex-col px-4 pb-8">
            <section class="admin-panel p-5">
                <div class="mb-4 flex items-start justify-between gap-3">
                    <StatusBadge :value="paymentStatus" />
                </div>

                <BillingDetailCustomerSection
                    :name="state.customer_name"
                    :lines="customerLines"
                    :date="formattedCreatedAt"
                />

                <BillingDetailTable
                    :columns="paymentDetailColumns"
                    :rows="paymentTableRows"
                    empty-message="No payment details recorded."
                    min-width="80rem"
                >
                    <template #cell-invoice_number="{ row }">
                        <router-link
                            v-if="invoiceRoute"
                            :to="invoiceRoute"
                            :class="billingDetailTableClasses.link"
                        >
                            {{ row.invoice_number }}
                        </router-link>
                        <span v-else>{{ row.invoice_number }}</span>
                    </template>

                    <template #cell-entered_paid_amount>
                        <div
                            v-if="canEditPaidAmount"
                            class="payment-paid-amount-cell"
                        >
                            <InputNumber
                                v-model="paidAmountInput"
                                class="payment-paid-amount-input w-full"
                                mode="currency"
                                currency="MMK"
                                locale="en-US"
                                :min-fraction-digits="0"
                                :max-fraction-digits="0"
                                :min="0"
                            />
                            <small
                                v-if="paidAmountError"
                                class="p-error block text-left"
                            >{{ paidAmountError }}</small>
                        </div>
                        <span v-else>{{ formattedEnteredPaidAmount }}</span>
                    </template>

                    <template #cell-remaining_balance>
                        {{ formatCurrency(displayRemainingBalance) }}
                    </template>
                </BillingDetailTable>

                <div
                    v-if="state.note"
                    class="mt-6"
                >
                    <p class="mb-1 text-sm font-semibold">Payment Method / Reference</p>
                    <p class="m-0 text-sm text-[var(--admin-text-muted)]">
                        {{ state.payment_method_name || '—' }}
                        <span v-if="state.note"> · {{ state.note }}</span>
                    </p>
                </div>

                <div
                    v-if="proofPreview"
                    class="mt-8"
                >
                    <p class="mb-2 text-sm font-semibold">Payment Proof</p>
                    <button
                        type="button"
                        class="block max-w-full border-0 bg-transparent p-0"
                        @click="showProofPreview = true"
                    >
                        <img
                            :src="proofPreview"
                            alt="Payment proof"
                            class="max-h-80 max-w-full cursor-zoom-in rounded border border-[var(--admin-border)]"
                        >
                    </button>
                </div>

                <div
                    v-if="!isApprovalView"
                    class="mt-4"
                >
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

                <p
                    v-if="paymentSummaryNote"
                    :class="billingDetailTableClasses.summary"
                >
                    {{ paymentSummaryNote }}
                </p>

                <p
                    v-if="state.rejection_reason"
                    class="mt-4 text-sm text-[var(--admin-danger, #b42318)]"
                >
                    Rejection reason: {{ state.rejection_reason }}
                </p>
            </section>
        </div>

        <Dialog
            v-model:visible="showProofPreview"
            modal
            header="Payment Proof"
            class="w-full max-w-5xl"
        >
            <img
                v-if="proofPreview"
                :src="proofPreview"
                alt="Payment proof full size"
                class="max-h-[80vh] w-full object-contain"
            >
        </Dialog>

        <RejectContractDialog
            v-model="showRejectDialog"
            header="Reject Payment"
            description="Please provide a reason explaining why this payment is being rejected."
            @confirm="confirmReject"
        />

        <Loading v-if="isLoading || isUploading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import WorkflowActionBar from '@/components/admin/WorkflowActionBar.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import BillingDetailCustomerSection from '@/components/billing/BillingDetailCustomerSection.vue';
import BillingDetailTable from '@/components/billing/BillingDetailTable.vue';
import { billingDetailTableClasses } from '@/helpers/billing/billingDetailHelpers';
import { paymentDetailColumns } from '@/helpers/billing/billingDetailColumns';
import useShowPayment from './useShowPayment';

export default defineComponent({
    name: 'ShowPayment',
    components: {
        FileUpload,
        Button,
        InputNumber,
        Dialog,
        Loading,
        StatusBadge,
        WorkflowActionBar,
        RejectContractDialog,
        BillingDetailCustomerSection,
        BillingDetailTable,
    },
    setup() {
        const payment = useShowPayment();

        return {
            ...payment,
            paymentDetailColumns,
            billingDetailTableClasses,
        };
    },
});
</script>

<style scoped>
.payment-paid-amount-cell {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    min-width: 9.5rem;
}

.payment-paid-amount-input :deep(.p-inputnumber-input) {
    width: 100%;
    text-align: right;
}
</style>
