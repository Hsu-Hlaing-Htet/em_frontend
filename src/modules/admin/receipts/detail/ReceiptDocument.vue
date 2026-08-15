<template>
    <div v-if="!isLoading" class="min-h-screen">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <DocumentDownloadActions
                    @download-pdf="downloadPdf"
                    @export-document="exportPdf"
                    @print="printPdf"
                />
                <Button
                    v-if="canSendEmail"
                    icon="pi pi-envelope"
                    label="Send Email"
                    :loading="isSendingEmail"
                    @click="handleSendEmail"
                />
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
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ReceiptDocumentSheet from '@/components/admin/documents/ReceiptDocumentSheet.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import useReceiptDocumentPage from './useReceiptDocumentPage';

export default defineComponent({
    name: 'ReceiptDocument',
    components: { Button, Loading, ReceiptDocumentSheet, DocumentDownloadActions },
    setup() {
        return useReceiptDocumentPage();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
