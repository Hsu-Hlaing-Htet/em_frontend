<template>
    <div v-if="!isLoading" class="min-h-screen">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <Button
                    icon="pi pi-download"
                    label="Download"
                    severity="secondary"
                    @click="downloadPdf"
                />
                <Button
                    icon="pi pi-print"
                    label="Print"
                    severity="secondary"
                    @click="printPdf"
                />
                <Button
                    icon="pi pi-file-export"
                    label="Export"
                    severity="secondary"
                    @click="exportPdf"
                />
                <Button
                    v-if="canSendEmail"
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
import useReceiptDocumentPage from './useReceiptDocumentPage';

export default defineComponent({
    name: 'ReceiptDocument',
    components: { Button, Loading, ReceiptDocumentSheet },
    setup() {
        return useReceiptDocumentPage();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
