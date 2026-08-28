<template>
    <div v-if="!isLoading">
        <header class="pdf-bar customer-contract-pdf-bar no-print">
            <div class="pdf-actions">
                <router-link :to="{ name: 'customerContractList' }">
                    <Button
                        :label="$t('common.back')"
                        icon="pi pi-arrow-left"
                        class="btn-outline"
                    />
                </router-link>
                <DocumentDownloadActions
                    @download-pdf="downloadPdf"
                    @export-document="exportPdf"
                    @print="printContract"
                />
            </div>
        </header>

        <div class="pdf-canvas customer-contract-pdf-canvas">
            <div class="pdf-frame">
                <ContractPdfSheet
                    v-if="document"
                    :variant="documentVariant"
                    :document="document"
                    show-approval-section
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
import ContractPdfSheet from '@/components/admin/documents/ContractPdfSheet.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import useCustomerShowContract from '@/composables/customer/useCustomerShowContract';

export default defineComponent({
    name: 'CustomerShowContract',
    components: { Button, ContractPdfSheet, DocumentDownloadActions, Loading },
    setup() {
        return useCustomerShowContract();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
