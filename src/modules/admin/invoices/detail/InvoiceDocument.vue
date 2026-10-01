<template>
    <div v-if="canApproveInvoice" class="min-h-full px-4 pb-8">
        <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="m-0 text-xl font-semibold">Invoice Approval Detail</h1>
                <p class="mt-1 mb-0 text-sm text-[var(--admin-text-muted)]">
                    Review, edit, and issue this invoice
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <Button
                    v-if="documentHtml"
                    label="View"
                    icon="pi pi-eye"
                    severity="secondary"
                    :disabled="isConfirming"
                    @click="viewPdf"
                />
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" :disabled="isConfirming" />
                </router-link>
            </div>
        </div>

        <div v-if="!isLoading" class="mx-auto max-w-6xl">
            <InvoiceApprovalDetailCard
                :form="reviewForm"
                :errors="reviewErrors"
                :late-fee-rule-options="lateFeeRuleOptions"
                :late-fee-selection="lateFeeSelection"
                :admin-remark="approvalRemark"
                :disabled="isConfirming"
                @update:late-fee-selection="onLateFeeSelectionChange"
                @update:admin-remark="approvalRemark = $event"
                @confirm="confirmInvoice"
            />
        </div>

        <Loading v-if="isLoading" />
    </div>

    <div v-else-if="!isLoading" class="min-h-screen">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <DocumentDownloadActions
                    v-if="canDownloadInvoice"
                    :has-document-export="false"
                    @download-pdf="downloadPdf"
                    @print="printPdf"
                />
                <Button
                    v-if="canSendInvoice"
                    icon="pi pi-envelope"
                    label="Send"
                    :loading="isSendingEmail"
                    :disabled="isSendingEmail"
                    @click="openSendEmailDialog"
                />
                <Button
                    v-if="canRecordPayment"
                    icon="pi pi-wallet"
                    label="Pay"
                    @click="goRecordPayment"
                />
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <InvoiceDocumentSheet :html="documentHtml" />
            </div>
        </div>
    </div>

    <Loading v-else />

    <SendDocumentEmailDialog
        v-model="showSendEmailDialog"
        document-kind="invoice"
        :document-number="state.invoice_number"
        :recipients="emailRecipients"
        :submitting="isSendingEmail"
        @confirm="confirmSendEmail"
    />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import InvoiceDocumentSheet from '@/components/admin/documents/InvoiceDocumentSheet.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import SendDocumentEmailDialog from '@/components/admin/SendDocumentEmailDialog.vue';
import InvoiceApprovalDetailCard from './InvoiceApprovalDetailCard.vue';
import useInvoiceDocumentPage from './useInvoiceDocumentPage';

export default defineComponent({
    name: 'InvoiceDocument',
    components: {
        Button,
        Loading,
        InvoiceDocumentSheet,
        DocumentDownloadActions,
        SendDocumentEmailDialog,
        InvoiceApprovalDetailCard,
    },
    setup() {
        return useInvoiceDocumentPage();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
