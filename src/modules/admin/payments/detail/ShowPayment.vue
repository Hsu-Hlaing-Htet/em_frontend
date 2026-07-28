<template>
    <div class="min-h-full">
        <div class="mb-10 flex flex-wrap items-end justify-end gap-2">
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
            <router-link
                v-if="documentRoute"
                :to="documentRoute"
            >
                <Button
                    icon="pi pi-file"
                    label="View Document"
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

        <div v-if="!isLoading" class="mx-auto flex max-w-4xl flex-col px-4 pb-8">
            <section class="admin-panel p-5">
                <BillingDetailCustomerSection
                    :name="state.customer_name"
                    :lines="customerLines"
                    :date="formattedCreatedAt"
                />

                <BillingDetailTable
                    :columns="paymentDetailColumns"
                    :rows="paymentTableRows"
                    empty-message="No payment details recorded."
                    :total-value="formatCurrency(state.amount)"
                    min-width="40rem"
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
                    <template #cell-status="{ value }">
                        <StatusBadge :value="value" />
                    </template>
                </BillingDetailTable>

                <div v-if="proofPreview" class="mt-8">
                    <img
                        :src="proofPreview"
                        alt="Payment proof"
                        class="max-h-80 rounded border border-[var(--admin-border)]"
                    >
                </div>

                <div class="mt-4">
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
            </section>
        </div>

        <Loading v-if="isLoading || isUploading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import WorkflowActionBar from '@/components/admin/WorkflowActionBar.vue';
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
        Loading,
        StatusBadge,
        WorkflowActionBar,
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
