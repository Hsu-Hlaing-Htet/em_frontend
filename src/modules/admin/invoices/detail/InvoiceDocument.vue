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
                    icon="pi pi-envelope"
                    label="Send Email"
                    @click="sendEmail"
                />
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <InvoiceDocumentSheet :document="document" />
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import InvoiceDocumentSheet from '@/components/admin/documents/InvoiceDocumentSheet.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import useInvoiceDocumentPage from './useInvoiceDocumentPage';

export default defineComponent({
    name: 'InvoiceDocument',
    components: { Button, Loading, InvoiceDocumentSheet, DocumentDownloadActions },
    setup() {
        return useInvoiceDocumentPage();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
