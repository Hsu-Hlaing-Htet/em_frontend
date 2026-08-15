<template>
    <div v-if="!isLoading" class="">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <DocumentDownloadActions
                    @download-pdf="downloadPdf"
                    @export-document="exportPdf"
                    @print="printContract"
                />
                <Button
                    icon="pi pi-envelope"
                    label="Send Email"
                    @click="sendEmail"
                />
                <Button
                    v-if="canCancel"
                    icon="pi pi-ban"
                    label="Cancel Contract"
                    severity="danger"
                    @click="openCancelDialog"
                />
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <ContractPdfSheet
                    v-if="document"
                    variant="sale"
                    :document="document"
                    :field-sections="fieldSections"
                    show-approval-section
                />
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />

    <CancelContractDialog
        v-model="showCancelDialog"
        @confirm="cancelContract"
    />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ContractPdfSheet from '@/components/admin/documents/ContractPdfSheet.vue';
import CancelContractDialog from '@/components/admin/contracts/CancelContractDialog.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import useShowActiveSale from './useShowActiveSale';

export default defineComponent({
    name: 'ShowActiveSale',
    components: { Button, Loading, ContractPdfSheet, CancelContractDialog, DocumentDownloadActions },
    setup() {
        return useShowActiveSale();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
