<template>
    <div class="min-h-full">
        <div class="mb-10 flex flex-wrap items-end justify-end gap-2">
            <router-link v-if="isApprovalView && documentRoute" :to="documentRoute">
                <Button icon="pi pi-eye" label="View" severity="secondary" />
            </router-link>
            <Button
                v-if="canApprove()"
                icon="pi pi-check"
                label="Approve"
                severity="success"
                :loading="workflowLoading.approve"
                :disabled="workflowLoading.approve || workflowLoading.reject"
                @click="showApproveDialog = true"
            />
            <Button
                v-if="canReject()"
                icon="pi pi-times"
                label="Reject"
                severity="danger"
                outlined
                :loading="workflowLoading.reject"
                :disabled="workflowLoading.approve || workflowLoading.reject"
                @click="showRejectDialog = true"
            />
            <Button
                v-if="!isApprovalView && canSendEmail()"
                icon="pi pi-envelope"
                label="Send"
                :loading="isSendingEmail"
                @click="handleSendEmail"
            />
            <Button
                v-if="!isApprovalView"
                icon="pi pi-download"
                label="Download"
                severity="secondary"
                @click="downloadPdf"
            />
            <router-link
                v-if="!isApprovalView && documentRoute"
                :to="documentRoute"
            >
                <Button
                    icon="pi pi-file"
                    label="View"
                    severity="secondary"
                />
            </router-link>
            <router-link :to="backRoute">
                <Button label="Back" />
            </router-link>
        </div>

        <div
    v-if="!isLoading"
    class="mx-auto flex w-full min-w-0 max-w-7xl flex-col px-4 pb-8"
>
    <section class="admin-panel w-full min-w-0 p-5">
                <div class="mb-4 flex items-start justify-between gap-3">
                    <StatusBadge :value="state.display_status || state.approval_status || state.status" />
                </div>

                <BillingDetailCustomerSection
                    :name="state.customer_name"
                    :lines="customerLines"
                    :date="formattedCreatedAt"
                />

                <div class="w-full max-w-full min-w-0 overflow-x-auto pb-2">
                    <BillingDetailTable
                        :columns="receiptLineItemColumns"
                        :rows="lineItemRows"
                        :rowspan-keys="receiptLineItemRowspanKeys"
                        empty-message="No receipt line items recorded."
                        min-width="56rem"
                    />
                </div>

                <p
                    v-if="receiptSummaryNote"
                    :class="billingDetailTableClasses.summary"
                >
                    {{ receiptSummaryNote }}
                </p>
            </section>
        </div>

        <Loading v-if="isLoading" />

        <ApproveRecordDialog
            v-model="showApproveDialog"
            entity="receipt"
            :submitting="workflowLoading.approve"
            @confirm="runWorkflow('approve')"
        />
        <RejectContractDialog
            v-model="showRejectDialog"
            entity="receipt"
            :submitting="workflowLoading.reject"
            :close-on-confirm="false"
            @confirm="runWorkflow('reject', { rejection_reason: $event })"
        />
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import ApproveRecordDialog from '@/components/admin/ApproveRecordDialog.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import BillingDetailCustomerSection from '@/components/billing/BillingDetailCustomerSection.vue';
import BillingDetailTable from '@/components/billing/BillingDetailTable.vue';
import { billingDetailTableClasses } from '@/helpers/billing/billingDetailHelpers';
import {
    receiptLineItemColumns,
    receiptLineItemRowspanKeys,
} from '@/helpers/billing/billingDetailColumns';
import {
    buildReceiptCustomerInfo,
    buildReceiptSummaryNote,
    mapReceiptLineItemRows,
} from '@/helpers/receipts/receiptDetailHelpers';
import { formatCurrency } from '@/utils/formatter';
import useShowReceipt from './useShowReceipt';

export default defineComponent({
    name: 'ShowReceipt',
    components: {
        Button,
        Loading,
        StatusBadge,
        ApproveRecordDialog,
        RejectContractDialog,
        BillingDetailCustomerSection,
        BillingDetailTable,
    },
    setup() {
        const receipt = useShowReceipt();

        const lineItemRows = computed(() => mapReceiptLineItemRows(receipt.state, formatCurrency));
        const customerLines = computed(() => buildReceiptCustomerInfo(receipt.state).lines);
        const receiptSummaryNote = computed(() => buildReceiptSummaryNote(receipt.state));

        return {
            ...receipt,
            receiptLineItemColumns,
            receiptLineItemRowspanKeys,
            lineItemRows,
            customerLines,
            receiptSummaryNote,
            billingDetailTableClasses,
        };
    },
});
</script>
