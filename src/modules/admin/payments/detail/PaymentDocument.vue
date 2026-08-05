<template>
    <div v-if="!isLoading" class="min-h-screen">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
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
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import BillingDocumentSheet from '@/components/admin/documents/BillingDocumentSheet.vue';
import usePaymentDocumentPage from './usePaymentDocumentPage';

export default defineComponent({
    name: 'PaymentDocument',
    components: { Button, Loading, BillingDocumentSheet },
    setup() {
        return usePaymentDocumentPage();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
