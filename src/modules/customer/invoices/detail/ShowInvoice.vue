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
                    <InvoiceDocumentSheet :html="documentHtml" />
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

                        <div
                            v-if="selectedPaymentMethod"
                            class="customer-payment-method-details md:col-span-2"
                        >
                            <h3 class="customer-payment-method-details__title">
                                {{ selectedPaymentMethod.name }}
                            </h3>

                            <div
                                v-if="selectedPaymentMethod.phone_number"
                                class="customer-payment-method-details__row"
                            >
                                <div class="customer-payment-method-details__meta">
                                    <span class="customer-payment-method-details__label">
                                        {{ $t('customer.phoneNumber') }}
                                    </span>
                                    <span class="customer-payment-method-details__value rw-numeric">
                                        {{ selectedPaymentMethod.phone_number }}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    class="customer-payment-copy-btn"
                                    @click="copyField('phone', selectedPaymentMethod.phone_number)"
                                >
                                    {{ copiedField === 'phone' ? $t('common.copied') : $t('common.copy') }}
                                </button>
                            </div>

                            <div
                                v-if="selectedPaymentMethod.account_name"
                                class="customer-payment-method-details__row"
                            >
                                <div class="customer-payment-method-details__meta">
                                    <span class="customer-payment-method-details__label">
                                        {{ $t('customer.accountName') }}
                                    </span>
                                    <span class="customer-payment-method-details__value">
                                        {{ selectedPaymentMethod.account_name }}
                                    </span>
                                </div>
                            </div>

                            <div
                                v-if="selectedPaymentMethod.account_number"
                                class="customer-payment-method-details__row"
                            >
                                <div class="customer-payment-method-details__meta">
                                    <span class="customer-payment-method-details__label">
                                        {{ $t('customer.accountNumber') }}
                                    </span>
                                    <span class="customer-payment-method-details__value rw-numeric">
                                        {{ selectedPaymentMethod.account_number }}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    class="customer-payment-copy-btn"
                                    @click="copyField('account', selectedPaymentMethod.account_number)"
                                >
                                    {{ copiedField === 'account' ? $t('common.copied') : $t('common.copy') }}
                                </button>
                            </div>

                            <div
                                v-if="selectedPaymentMethod.qr_image_url"
                                class="customer-payment-method-details__qr"
                            >
                                <img
                                    :src="selectedPaymentMethod.qr_image_url"
                                    :alt="`${selectedPaymentMethod.name} QR`"
                                    class="customer-payment-method-details__qr-image"
                                >
                            </div>

                            <p
                                v-if="selectedPaymentMethod.instructions"
                                class="customer-payment-method-details__instructions"
                            >
                                {{ selectedPaymentMethod.instructions }}
                            </p>
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
        return useCustomerShowInvoice();
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

.customer-payment-method-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.95rem 1rem;
    border: 1px solid var(--admin-border);
    border-radius: var(--customer-portal-card-radius, 6px);
    background: color-mix(in srgb, var(--admin-surface-solid) 92%, var(--admin-bg) 8%);
}

.customer-payment-method-details__title {
    margin: 0;
    color: var(--admin-text);
    font-family: var(--customer-font-ui);
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.35;
}

.customer-payment-method-details__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 0.75rem;
}

.customer-payment-method-details__meta {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 0.15rem;
}

.customer-payment-method-details__label {
    color: var(--admin-text-muted);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.3;
}

.customer-payment-method-details__value {
    color: var(--admin-text);
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.35;
    overflow-wrap: anywhere;
}

.customer-payment-copy-btn {
    min-height: 2rem;
    padding: 0.25rem 0.7rem;
    border: 1px solid var(--admin-border);
    border-radius: 4px;
    background: transparent;
    color: var(--rw-brand, var(--admin-primary));
    font-family: var(--customer-font-ui);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
}

.customer-payment-copy-btn:hover,
.customer-payment-copy-btn:focus-visible {
    border-color: color-mix(in srgb, var(--rw-brand, var(--admin-primary)) 45%, var(--admin-border));
    outline: none;
}

.customer-payment-method-details__qr {
    display: flex;
    justify-content: flex-start;
}

.customer-payment-method-details__qr-image {
    width: 140px;
    height: 140px;
    max-width: 100%;
    border: 1px solid var(--admin-border);
    border-radius: 4px;
    background: #fff;
    object-fit: contain;
}

.customer-payment-method-details__instructions {
    margin: 0;
    color: var(--admin-text-muted);
    font-size: 0.8125rem;
    line-height: 1.45;
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

    .customer-payment-method-details__qr-image {
        width: 130px;
        height: 130px;
    }
}
</style>
