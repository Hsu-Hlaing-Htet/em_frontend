<template>
    <div v-if="!isLoading" class="min-h-screen">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <Button
                    v-if="isApprovalView && documentHtml"
                    icon="pi pi-eye"
                    label="View"
                    severity="secondary"
                    @click="viewPdf"
                />
                <DocumentDownloadActions
                    v-else-if="canDownloadInvoice"
                    :has-document-export="false"
                    @download-pdf="downloadPdf"
                    @print="printPdf"
                />
                <Button
                    v-if="canApproveInvoice"
                    icon="pi pi-check"
                    label="Approve"
                    :loading="isApproving"
                    :disabled="isApproving || isRejecting"
                    @click="showApproveDialog = true"
                />
                <Button
                    v-if="canRejectInvoice"
                    icon="pi pi-times"
                    label="Reject"
                    severity="danger"
                    :loading="isRejecting"
                    :disabled="isApproving || isRejecting"
                    @click="openRejectDialog"
                />
                <Button
                    v-if="canSendInvoice"
                    icon="pi pi-envelope"
                    label="Send"
                    @click="sendEmail"
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

    <Loading v-if="isLoading" />

    <ApproveRecordDialog
        v-model="showApproveDialog"
        entity="invoice"
        :submitting="isApproving"
        @confirm="approveInvoice"
    />
    <RejectContractDialog
        v-model="showRejectDialog"
        entity="invoice"
        :submitting="isRejecting"
        :close-on-confirm="false"
        @confirm="rejectInvoice"
    />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import InvoiceDocumentSheet from '@/components/admin/documents/InvoiceDocumentSheet.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import ApproveRecordDialog from '@/components/admin/ApproveRecordDialog.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import useInvoiceDocumentPage from './useInvoiceDocumentPage';

export default defineComponent({
    name: 'InvoiceDocument',
    components: {
        Button,
        Loading,
        InvoiceDocumentSheet,
        DocumentDownloadActions,
        ApproveRecordDialog,
        RejectContractDialog,
    },
    setup() {
        return useInvoiceDocumentPage();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
