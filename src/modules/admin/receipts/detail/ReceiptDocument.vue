<template>
    <div v-if="!isLoading" class="min-h-screen">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <template v-if="isApprovalView">
                    <Button
                        v-if="document"
                        icon="pi pi-eye"
                        label="View"
                        severity="secondary"
                        @click="viewPdf"
                    />
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
                </template>
                <template v-else>
                    <Button
                        icon="pi pi-download"
                        label="Download"
                        severity="secondary"
                        @click="downloadPdf"
                    />
                    <Button
                        v-if="canSendEmail"
                        icon="pi pi-envelope"
                        label="Send"
                        :loading="isSendingEmail"
                        @click="handleSendEmail"
                    />
                </template>
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <ReceiptDocumentSheet :document="document" />
            </div>
        </div>
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
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ReceiptDocumentSheet from '@/components/admin/documents/ReceiptDocumentSheet.vue';
import ApproveRecordDialog from '@/components/admin/ApproveRecordDialog.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import useReceiptDocumentPage from './useReceiptDocumentPage';

export default defineComponent({
    name: 'ReceiptDocument',
    components: {
        Button,
        Loading,
        ReceiptDocumentSheet,
        ApproveRecordDialog,
        RejectContractDialog,
    },
    setup() {
        return useReceiptDocumentPage();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
