<template>
    <div class="customer-portal-page customer-payment-detail-page">
        <CustomerPageHeader
            title="Payment Details"
            subtitle="View payment information and invoice summary"
        >
            <template #actions>
                <router-link :to="{ name: 'customerPaymentList' }">
                    <Button label="Back" severity="secondary" />
                </router-link>
                <router-link v-if="invoiceRoute" :to="invoiceRoute">
                    <Button label="View Invoice" severity="secondary" />
                </router-link>
                <router-link v-if="isRejected && makePaymentAgainRoute" :to="makePaymentAgainRoute">
                    <Button label="Make Payment Again" icon="pi pi-wallet" />
                </router-link>
                <router-link v-if="isApproved && receiptRoute" :to="receiptRoute">
                    <Button label="View Receipt" icon="pi pi-receipt" />
                </router-link>
            </template>
        </CustomerPageHeader>

        <Loading v-if="isLoading" />

        <section v-else class="admin-panel customer-payment-detail-card">
            <div class="customer-payment-detail-card__head">
                <div>
                    <h2 class="customer-payment-detail-card__title">{{ summaryItems[0].value }}</h2>
                    <p v-if="isPending" class="customer-payment-detail-message">Awaiting admin review.</p>
                </div>

                <div class="customer-payment-detail-status">
                    <StatusBadge :value="paymentStatus" />
                </div>
            </div>

            <dl class="customer-payment-summary-grid">
                <div
                    v-for="item in summaryItems.slice(1)"
                    :key="item.label"
                    class="customer-payment-summary-item"
                >
                    <dt>{{ item.label }}</dt>
                    <dd>
                        <span>{{ item.value }}</span>
                    </dd>
                </div>
            </dl>

            <div class="customer-payment-detail-divider"></div>

            <section class="customer-payment-invoice-summary">
                <h2 class="customer-section-title">Invoice Summary</h2>

                <div class="customer-payment-table-wrap">
                    <table class="customer-payment-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th class="is-center">Previous Unit</th>
                                <th class="is-center">Current Unit</th>
                                <th class="is-center">Usage</th>
                                <th class="is-num">Unit Price</th>
                                <th class="is-num">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in invoiceRows" :key="row.id || `${row.description}-${index}`">
                                <td>{{ row.description }}</td>
                                <td class="is-center">{{ row.previous_reading }}</td>
                                <td class="is-center">{{ row.current_reading }}</td>
                                <td class="is-center">{{ row.usage }}</td>
                                <td class="is-num">{{ row.unit_price }}</td>
                                <td class="is-num">{{ row.amount }}</td>
                            </tr>
                            <tr v-if="!invoiceRows.length">
                                <td colspan="6">No invoice charges recorded.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="customer-payment-total-grid">
                    <span>Subtotal</span>
                    <strong>{{ formatMoney(invoice.total_amount) }}</strong>
                    <span>Late Fee</span>
                    <strong>{{ formatMoney(invoice.late_fee) }}</strong>
                    <span>Amount Due</span>
                    <strong>{{ formatMoney(invoice.amount_due) }}</strong>
                </div>

                <p v-if="lateFeeDescription" class="customer-payment-late-fee-note">
                    {{ lateFeeDescription }}
                </p>
            </section>

            <div class="customer-payment-detail-divider"></div>

            <section class="customer-payment-proof-section">
                <h2 class="customer-section-title">Payment Proof</h2>
                <button
                    v-if="state.proof_image_url"
                    type="button"
                    class="customer-payment-proof-button"
                    @click="showProofPreview = true"
                >
                    <img :src="state.proof_image_url" alt="Payment proof">
                </button>
                <p v-else class="customer-payment-detail-muted">No payment proof uploaded.</p>

                <p v-if="isRejected && state.rejection_reason" class="customer-payment-rejection-note">
                    Admin Remark / Rejection Reason: {{ state.rejection_reason }}
                </p>
            </section>
        </section>

        <Dialog v-model:visible="showProofPreview" modal header="Payment Proof" class="w-full max-w-5xl">
            <img
                v-if="state.proof_image_url"
                :src="state.proof_image_url"
                alt="Payment proof full size"
                class="max-h-[80vh] w-full object-contain"
            >
        </Dialog>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerShowPayment from '@/composables/customer/useCustomerShowPayment';

export default defineComponent({
    name: 'CustomerShowPayment',
    components: {
        Button,
        Dialog,
        Loading,
        StatusBadge,
        CustomerPageHeader,
    },
    setup() {
        return useCustomerShowPayment();
    },
});
</script>

<style scoped>
.customer-payment-detail-page {
    min-width: 0;
}

.customer-payment-detail-card {
    padding: clamp(1rem, 3vw, 1.5rem);
}

.customer-payment-detail-card__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.customer-payment-detail-card__title {
    margin: 0;
    color: var(--admin-text);
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
}

.customer-payment-detail-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;
}

.customer-payment-detail-status p,
.customer-payment-detail-message,
.customer-payment-detail-muted {
    margin: 0;
    color: var(--admin-text-muted);
    font-size: 0.875rem;
    font-weight: 400;
}

.customer-payment-summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem 2rem;
    margin: 0;
}

.customer-payment-summary-item {
    display: grid;
    grid-template-columns: minmax(8rem, 0.45fr) minmax(0, 1fr);
    gap: 0.75rem;
    min-width: 0;
}

.customer-payment-summary-item dt {
    color: var(--admin-text-muted);
    font-size: 0.8125rem;
    font-weight: 500;
}

.customer-payment-summary-item dd {
    min-width: 0;
    margin: 0;
    color: var(--admin-text);
    font-size: 0.875rem;
    font-weight: 400;
    overflow-wrap: anywhere;
}

.customer-payment-detail-divider {
    margin: 1.5rem 0;
    border-top: 1px solid var(--admin-border);
}

.customer-payment-table-wrap {
    width: 100%;
    overflow-x: auto;
}

.customer-payment-table {
    width: 100%;
    min-width: 48rem;
    border-collapse: collapse;
}

.customer-payment-table th,
.customer-payment-table td {
    border-bottom: 1px solid var(--admin-border);
    padding: 0.75rem 0.5rem;
    color: var(--admin-text);
    font-size: 0.875rem;
    font-weight: 400;
    text-align: left;
}

.customer-payment-table th {
    color: var(--admin-text-muted);
    font-size: 0.8125rem;
    font-weight: 600;
}

.customer-payment-table .is-center {
    text-align: center;
}

.customer-payment-table .is-num {
    text-align: right;
    white-space: nowrap;
}

.customer-payment-total-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(9rem, auto);
    gap: 0.5rem 1rem;
    width: min(100%, 24rem);
    margin: 1rem 0 0 auto;
}

.customer-payment-total-grid span {
    color: var(--admin-text);
    font-size: 0.875rem;
    font-weight: 500;
}

.customer-payment-total-grid strong {
    color: var(--admin-text);
    font-size: 0.875rem;
    font-weight: 600;
    text-align: right;
    white-space: nowrap;
}

.customer-payment-late-fee-note,
.customer-payment-rejection-note {
    margin: 1rem 0 0;
    color: var(--admin-text-muted);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
}

.customer-payment-rejection-note {
    color: var(--admin-danger, #b42318);
}

.customer-payment-proof-button {
    display: block;
    width: min(100%, 42rem);
    min-height: 12rem;
    border: 1px solid var(--admin-border);
    border-radius: 6px;
    background: var(--admin-surface);
    padding: 0.75rem;
    cursor: zoom-in;
}

.customer-payment-proof-button img {
    display: block;
    width: 100%;
    max-height: 26rem;
    object-fit: contain;
}

@media (max-width: 767px) {
    .customer-payment-summary-grid,
    .customer-payment-summary-item {
        grid-template-columns: minmax(0, 1fr);
    }

    .customer-payment-detail-status {
        align-items: flex-start;
    }

    .customer-payment-total-grid {
        margin-left: 0;
    }
}
</style>
