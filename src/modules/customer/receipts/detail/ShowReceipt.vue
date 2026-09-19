<template>
    <div v-if="!isLoading" class="customer-portal-page customer-document-page">
        <CustomerPageHeader
            class="no-print"
            :title="$t('customer.receiptDocument')"
            :subtitle="$t('customer.receiptDocumentLead')"
        >
            <template #actions>
                <div class="pdf-actions no-print">
                    <Button
                        icon="pi pi-download"
                        :label="$t('customer.downloadReceipt')"
                        :loading="isDownloading"
                        @click="downloadPdf"
                    />
                    <router-link :to="backRoute">
                        <Button
                            :label="$t('common.back')"
                            severity="secondary"
                        />
                    </router-link>
                </div>
            </template>
        </CustomerPageHeader>

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
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerShowReceipt from '@/composables/customer/useCustomerShowReceipt';

export default defineComponent({
    name: 'CustomerShowReceipt',
    components: {
        Button,
        Loading,
        ReceiptDocumentSheet,
        CustomerPageHeader,
    },
    setup() {
        return useCustomerShowReceipt();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
