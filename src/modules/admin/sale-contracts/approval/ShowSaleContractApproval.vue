<template>
    <div v-if="!isLoading" class="pdf-view">
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
                    icon="pi pi-check"
                    label="Approve"
                    severity="success"
                    @click="approveContract"
                />
                <Button
                    icon="pi pi-times"
                    label="Reject"
                    severity="danger"
                    @click="openRejectDialog"
                />
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <ContractPdfSheet
                    variant="sale"
                    :document="document"
                    :field-sections="fieldSections"
                    show-approval-section
                />
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />

    <RejectContractDialog
        v-model="showRejectDialog"
        @confirm="rejectContract"
    />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ContractPdfSheet from '@/components/admin/documents/ContractPdfSheet.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import useShowSaleContractApproval from './useShowSaleContractApproval';

export default defineComponent({
    name: 'ShowSaleContractApproval',
    components: { Button, Loading, ContractPdfSheet, RejectContractDialog },
    setup() {
        return useShowSaleContractApproval();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
