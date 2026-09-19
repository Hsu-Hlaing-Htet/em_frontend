<template>
    <div v-if="!isLoading" class="customer-portal-page customer-document-page">
        <CustomerPageHeader
            class="no-print"
            :title="$t('customer.invoiceDocument')"
            :subtitle="$t('customer.invoiceDocumentLead')"
        >
            <template #actions>
                <div class="pdf-actions no-print">
                    <DocumentDownloadActions
                        :has-document-export="false"
                        @download-pdf="downloadPdf"
                        @print="printPdf"
                    />
                    <router-link v-if="canMakePayment" :to="makePaymentRoute">
                        <Button label="Make Payment" icon="pi pi-wallet" />
                    </router-link>
                    <router-link :to="backRoute">
                        <Button label="Back" severity="secondary" />
                    </router-link>
                </div>
            </template>
        </CustomerPageHeader>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <InvoiceDocumentSheet :document="document" />
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { computed, defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import InvoiceDocumentSheet from '@/components/admin/documents/InvoiceDocumentSheet.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useInvoiceDocumentPage from '@/modules/admin/invoices/detail/useInvoiceDocumentPage';
import { useCustomerInvoiceStore } from '@/modules/customer/invoices/store';
import { service } from '@/modules/customer/service';

const customerInvoiceDocumentService = {
    downloadDocument: ({ id, fallbackFilename }) => service.downloadInvoiceDocument(id, fallbackFilename),
    sendDocumentEmail: () => Promise.resolve(),
};

export default defineComponent({
    name: 'CustomerInvoiceDocument',
    components: {
        Button,
        Loading,
        DocumentDownloadActions,
        InvoiceDocumentSheet,
        CustomerPageHeader,
    },
    setup() {
        const invoiceDocument = useInvoiceDocumentPage({
            store: useCustomerInvoiceStore(),
            service: customerInvoiceDocumentService,
            resolveBackRoute: () => ({ name: 'customerInvoiceList' }),
        });

        const canMakePayment = computed(() => (
            ['issued', 'overdue'].includes(String(invoiceDocument.state.status || '').toLowerCase())
                && Number(invoiceDocument.state.remaining_balance || invoiceDocument.state.amount_due || 0) > 0
                && !invoiceDocument.state.has_pending_payment
        ));

        const makePaymentRoute = computed(() => ({
            name: 'customerShowInvoice',
            params: { id: invoiceDocument.state.id },
            hash: '#make-payment',
        }));

        return {
            ...invoiceDocument,
            canMakePayment,
            makePaymentRoute,
        };
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
