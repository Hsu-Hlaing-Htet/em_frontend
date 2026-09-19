<template>
    <div v-if="!isLoading" class="">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <DocumentDownloadActions
                    :has-document-export="false"
                    @download-pdf="downloadPdf"
                    @export-document="exportPdf"
                    @print="printContract"
                />
                <Button
                    icon="pi pi-envelope"
                    label="Send"
                    :loading="isSendingEmail"
                    :disabled="isSendingEmail"
                    @click="openSendEmailDialog"
                />
                <Button
                    v-if="canCancel"
                    icon="pi pi-ban"
                    label="Terminate Contract"
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
                    variant="rent"
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

    <SendContractEmailDialog
        v-model="showSendEmailDialog"
        :customer-name="state.customer_name"
        :email="state.customer_email"
        :contract-no="state.contract_no"
        :submitting="isSendingEmail"
        @confirm="sendEmail"
    />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ContractPdfSheet from '@/components/admin/documents/ContractPdfSheet.vue';
import CancelContractDialog from '@/components/admin/contracts/CancelContractDialog.vue';
import SendContractEmailDialog from '@/components/admin/contracts/SendContractEmailDialog.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import useShowActiveRent from './useShowActiveRent';

export default defineComponent({
    name: 'ShowActiveRent',
    components: { Button, Loading, ContractPdfSheet, CancelContractDialog, SendContractEmailDialog, DocumentDownloadActions },
    setup() {
        return useShowActiveRent();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
