<template>
    <div v-if="!isLoading" class="min-h-screen">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <DocumentDownloadActions
                    v-if="!isApprovalView"
                    :has-document-export="false"
                    @download-pdf="downloadPdf"
                    @print="printPdf"
                />
                <Button
                    v-if="canSendUtility"
                    icon="pi pi-envelope"
                    label="Send"
                    :loading="isSendingEmail"
                    :disabled="isSendingEmail"
                    @click="openSendEmailDialog"
                />
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <BillingDocumentSheet
                    :document="document"
                    :document-title="sheetProps.documentTitle"
                    :reference-label="sheetProps.referenceLabel"
                    :get-meta="sheetProps.getMeta"
                    :render-lead="sheetProps.renderLead"
                    :render-body="sheetProps.renderBody"
                />
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />

    <SendDocumentEmailDialog
        v-model="showSendEmailDialog"
        document-kind="utility bill"
        :document-number="utilityReference"
        :recipients="emailRecipients"
        :submitting="isSendingEmail"
        @confirm="confirmSendEmail"
    />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import BillingDocumentSheet from '@/components/admin/documents/BillingDocumentSheet.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import SendDocumentEmailDialog from '@/components/admin/SendDocumentEmailDialog.vue';
import useUtilityDocumentPage from './useUtilityDocumentPage';

export default defineComponent({
    name: 'UtilityDocument',
    components: {
        Button,
        Loading,
        BillingDocumentSheet,
        DocumentDownloadActions,
        SendDocumentEmailDialog,
    },
    setup() {
        return useUtilityDocumentPage();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
