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
                    type="button"
                    icon="pi pi-check"
                    label="Approve"
                    severity="success"
                    :loading="isApproving"
                    :disabled="isApproving"
                    @click="approveContract"
                />
                <Button
                    type="button"
                    icon="pi pi-times"
                    label="Reject"
                    severity="danger"
                    @click="openRejectDialog"
                />
                <router-link :to="backRoute">
                    <Button type="button" label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <ContractPdfSheet
                    variant="rent"
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
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import useShowRentContractApproval from './useShowRentContractApproval';

export default defineComponent({
    name: 'ShowRentContractApproval',
    components: { Button, Loading, ContractPdfSheet, RejectContractDialog, DocumentDownloadActions },
    setup() {
        return useShowRentContractApproval();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
