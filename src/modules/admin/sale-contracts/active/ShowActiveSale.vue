<template>
    <div v-if="!isLoading" class="">
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
                    @click="printContract"
                />
                <Button
                    icon="pi pi-file-export"
                    label="Export"
                    severity="secondary"
                    @click="exportPdf"
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
import useShowActiveSale from './useShowActiveSale';

export default defineComponent({
    name: 'ShowActiveSale',
    components: { Button, Loading, ContractPdfSheet, CancelContractDialog },
    setup() {
        return useShowActiveSale();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
