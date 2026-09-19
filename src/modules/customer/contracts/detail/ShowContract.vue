<template>
    <div v-if="!isLoading" class="customer-portal-page customer-document-page">
        <CustomerPageHeader
            class="no-print"
            :title="$t('customer.contractDocument')"
            :subtitle="$t('customer.contractDocumentLead')"
        >
            <template #actions>
                <div class="pdf-actions customer-contract-pdf-bar no-print">
                    <router-link :to="{ name: 'customerContractList' }">
                        <Button
                            :label="$t('common.back')"
                            icon="pi pi-arrow-left"
                            class="btn-outline"
                        />
                    </router-link>
                    <DocumentDownloadActions
                        :has-document-export="false"
                        @download-pdf="downloadPdf"
                        @export-document="exportPdf"
                        @print="printContract"
                    />
                </div>
            </template>
        </CustomerPageHeader>

        <div class="pdf-canvas customer-contract-pdf-canvas">
            <div class="pdf-frame">
                <ContractPdfSheet
                    v-if="document"
                    :variant="documentVariant"
                    :document="document"
                    show-approval-section
                    show-approved-digital-copy-note
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
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerShowContract from '@/composables/customer/useCustomerShowContract';

export default defineComponent({
    name: 'CustomerShowContract',
    components: {
        Button,
        ContractPdfSheet,
        DocumentDownloadActions,
        Loading,
        CustomerPageHeader,
    },
    setup() {
        return useCustomerShowContract();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
