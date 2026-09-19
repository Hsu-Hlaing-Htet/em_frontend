<template>
    <div v-if="!isLoading" class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.payInvoice')"
            :subtitle="$t('customer.payInvoiceLead')"
        >
            <template #actions>
                <router-link :to="invoiceDocumentRoute">
                    <Button
                        :label="$t('common.back')"
                        icon="pi pi-arrow-left"
                        class="btn-outline"
                    />
                </router-link>
            </template>
        </CustomerPageHeader>

        <div class="customer-payment-page mx-auto flex max-w-5xl flex-col">
            <section class="admin-panel customer-payment-invoice-panel p-4">
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 class="customer-section-title m-0">{{ state.invoice_number || $t('customer.invoiceNo') }}</h2>
                    <StatusBadge :value="state.status" />
                </div>
                <div class="customer-payment-invoice-document">
                    <InvoiceDocumentSheet :document="document" />
                </div>
            </section>

            <section id="make-payment" class="customer-section mt-6">
                <h2 class="customer-section-title">{{ $t('customer.payInvoice') }}</h2>

                <div v-if="rejectionReason" class="customer-payment-message customer-payment-message--warning">
                    Rejection reason: {{ rejectionReason }}
                </div>

                <form v-if="canPay" class="admin-panel customer-payment-form p-5" @submit.prevent="submitPayment">
                    <div class="customer-payment-form-grid">
                        <div>
                            <label for="customer_payment_method" class="mb-2 block text-md">{{ $t('customer.paymentMethod') }}</label>
                            <Dropdown
                                id="customer_payment_method"
                                v-model="paymentForm.payment_method_id"
                                :options="paymentMethods"
                                option-label="label"
                                option-value="value"
                                :placeholder="$t('customer.selectMethod')"
                                class="w-full"
                            />
                            <small v-if="errors.has('payment_method_id')" class="p-error">
                                <div v-for="error in errors.get('payment_method_id')" :key="error">{{ error }}</div>
                            </small>
                        </div>

                        <div>
                            <label for="customer_payment_amount" class="mb-2 block text-md">{{ $t('customer.paymentAmount') }}</label>
                            <InputText
                                id="customer_payment_amount"
                                :model-value="formattedAmountDue"
                                class="w-full"
                                readonly
                            />
                            <small v-if="errors.has('amount')" class="p-error">
                                <div v-for="error in errors.get('amount')" :key="error">{{ error }}</div>
                            </small>
                        </div>

                        <div class="md:col-span-2">
                            <label class="mb-2 block text-md">{{ $t('customer.uploadPaymentProof') }}</label>
                            <p class="mb-2 text-sm text-[var(--admin-text-muted)]">
                                {{ $t('customer.paymentProofHelp') }}
                            </p>
                            <FileUpload
                                mode="basic"
                                :choose-label="$t('customer.uploadProof')"
                                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                :auto="false"
                                custom-upload
                                @select="onProofSelected"
                            />
                            <div v-if="proofPreviewUrl" class="mt-3 flex flex-col gap-2">
                                <img
                                    :src="proofPreviewUrl"
                                    :alt="$t('customer.uploadPaymentProof')"
                                    class="max-h-48 w-full max-w-sm rounded border border-[var(--admin-border)] object-contain"
                                >
                                <Button
                                    type="button"
                                    :label="$t('common.remove')"
                                    severity="secondary"
                                    size="small"
                                    class="self-start"
                                    @click="clearProofFile"
                                />
                            </div>
                            <small v-if="errors.has('proof')" class="p-error">
                                <div v-for="error in errors.get('proof')" :key="error">{{ error }}</div>
                            </small>
                        </div>
                    </div>

                    <div class="mt-8 flex flex-wrap justify-end gap-2">
                        <Button type="submit" :label="$t('customer.submitPayment')" :loading="isSaving" />
                        <router-link :to="invoiceDocumentRoute">
                            <Button type="button" :label="$t('common.cancel')" severity="secondary" />
                        </router-link>
                    </div>
                </form>

                <div v-else class="admin-panel customer-payment-message">
                    {{ paymentUnavailableMessage }}
                </div>
            </section>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Dropdown from '@/components/global/AppDropdown.vue';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import StatusBadge from '@/components/global/StatusBadge.vue';
import Loading from '@/components/global/Loading.vue';
import InvoiceDocumentSheet from '@/components/admin/documents/InvoiceDocumentSheet.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import { useInvoiceDocument } from '@/composables/admin/documents/useInvoiceDocument';
import useCustomerShowInvoice from '@/composables/customer/useCustomerShowInvoice';

export default defineComponent({
    name: 'CustomerShowInvoice',
    components: {
        Button,
        Dropdown,
        InputText,
        FileUpload,
        StatusBadge,
        Loading,
        InvoiceDocumentSheet,
        CustomerPageHeader,
    },
    setup() {
        const invoice = useCustomerShowInvoice();
        const { document } = useInvoiceDocument(invoice.state);

        return {
            ...invoice,
            document,
        };
    },
});
</script>

<style scoped>
.customer-payment-page {
    gap: 1.5rem;
}

.customer-payment-invoice-panel {
    overflow: hidden;
}

.customer-payment-invoice-document {
    overflow-x: auto;
}

.customer-payment-invoice-document :deep(.invoice-doc) {
    width: 100%;
    max-width: 100%;
    min-height: auto;
    margin: 0;
    padding: clamp(1rem, 3vw, 2rem);
}

.customer-payment-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
}

.customer-payment-message {
    padding: 1rem;
    color: var(--admin-text);
    font-size: 0.95rem;
    font-weight: 400;
}

.customer-payment-message--warning {
    margin-bottom: 1rem;
    border: 1px solid var(--status-warning-border, rgba(234, 179, 8, 0.35));
    border-radius: var(--customer-portal-card-radius, 3px);
    background: var(--status-warning-bg, rgba(234, 179, 8, 0.12));
    color: var(--status-warning-text, #a16207);
}

@media (max-width: 767px) {
    .customer-payment-form-grid {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
