<template>
    <section class="admin-panel payment-detail-card">
        <div class="payment-detail-card__head">
            <h2 class="payment-detail-card__payment-id">{{ paymentId }}</h2>
            <div class="payment-detail-card__head-meta">
                <span class="payment-detail-card__datetime">{{ submittedAt }}</span>
                <StatusBadge v-if="showStatus" :value="status" />
            </div>
        </div>

        <div class="payment-detail-card__divider" />

        <div class="payment-detail-card__info-grid">
            <div class="payment-detail-card__info-col">
                <div class="payment-detail-card__field">
                    <span>Invoice No.</span>
                    <strong>{{ invoiceNumber }}</strong>
                </div>
                <div class="payment-detail-card__field">
                    <span>Customer</span>
                    <strong>{{ customerName }}</strong>
                </div>
                <div class="payment-detail-card__field">
                    <span>Building</span>
                    <strong>{{ buildingName }}</strong>
                </div>
                <div class="payment-detail-card__field">
                    <span>Room</span>
                    <strong>{{ roomNumber }}</strong>
                </div>
            </div>
            <div class="payment-detail-card__info-col">
                <div class="payment-detail-card__field">
                    <span>Payment Date</span>
                    <strong>{{ paymentDate }}</strong>
                </div>
                <div class="payment-detail-card__field">
                    <span>Payment Method</span>
                    <strong>{{ paymentMethod }}</strong>
                </div>
            </div>
        </div>

        <div class="payment-detail-card__divider" />

        <div class="payment-detail-card__summary">
            <h3 class="payment-detail-card__section-title">Invoice Summary</h3>

            <div class="payment-detail-card__table-wrap">
                <table class="payment-detail-card__table">
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
                        <tr
                            v-for="(row, index) in invoiceRows"
                            :key="row.id || `${row.description}-${index}`"
                        >
                            <td>{{ row.description }}</td>
                            <td class="is-center">{{ row.previous_reading }}</td>
                            <td class="is-center">{{ row.current_reading }}</td>
                            <td class="is-center">{{ row.usage }}</td>
                            <td class="is-num">{{ row.unit_price }}</td>
                            <td class="is-num">{{ row.amount }}</td>
                        </tr>
                        <tr v-if="!invoiceRows.length">
                            <td colspan="6" class="is-empty">No invoice charges recorded.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="payment-detail-card__totals-wrap">
                <p v-if="showLateFeeHint" class="payment-detail-card__late-fee-hint">
                    Late fee is shown only when applicable.
                </p>
                <dl class="payment-detail-card__totals">
                    <div>
                        <dt>Sub Total</dt>
                        <dd>{{ subTotal }}</dd>
                    </div>
                    <div v-if="showLateFee">
                        <dt>Late Fee</dt>
                        <dd>{{ lateFee }}</dd>
                    </div>
                    <div class="is-total">
                        <dt>Amount Due</dt>
                        <dd>{{ total }}</dd>
                    </div>
                    <div class="is-separator">
                        <dt>{{ receivedLabel }}</dt>
                        <dd>{{ received }}</dd>
                    </div>
                    <div v-if="showChange">
                        <dt>{{ changeLabel }}</dt>
                        <dd>{{ change }}</dd>
                    </div>
                    <div>
                        <dt>Remaining Balance</dt>
                        <dd>{{ balance }}</dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="payment-detail-card__divider" />

        <div v-if="mode === 'approval'" class="payment-detail-card__verification">
            <h3 class="payment-detail-card__section-title">Payment Verification</h3>
            <div class="payment-detail-card__verification-grid">
                <div>
                    <p class="payment-detail-card__label">Payment Proof</p>
                    <button
                        v-if="proofPreview"
                        type="button"
                        class="payment-detail-card__proof"
                        @click="$emit('preview-proof')"
                    >
                        <img :src="proofPreview" alt="Payment proof preview">
                    </button>
                    <div v-else class="payment-detail-card__proof is-empty">
                        No payment proof uploaded.
                    </div>
                </div>
                <div>
                    <label class="payment-detail-card__label" for="admin-payment-remark">Admin Remark</label>
                    <Textarea
                        id="admin-payment-remark"
                        :model-value="adminRemark"
                        class="w-full"
                        rows="6"
                        placeholder="Enter verification note"
                        @update:model-value="$emit('update:adminRemark', $event)"
                    />
                </div>
            </div>

            <div v-if="canReview" class="payment-detail-card__actions">
                <Button
                    label="Approve"
                    icon="pi pi-check"
                    :loading="approving"
                    :disabled="rejecting || approveDisabled"
                    @click="$emit('approve')"
                />
                <Button
                    label="Reject"
                    icon="pi pi-times"
                    severity="danger"
                    outlined
                    :loading="rejecting"
                    :disabled="approving"
                    @click="$emit('reject')"
                />
                <span class="payment-detail-card__reject-hint">Reject requires a reason.</span>
            </div>
        </div>

        <div v-else class="payment-detail-card__proof-view">
            <h3 class="payment-detail-card__section-title">Payment Proof</h3>
            <div class="payment-detail-card__proof-view-grid">
                <button
                    v-if="proofPreview"
                    type="button"
                    class="payment-detail-card__proof"
                    @click="$emit('preview-proof')"
                >
                    <img :src="proofPreview" alt="Payment proof preview">
                </button>
                <div v-else class="payment-detail-card__proof is-empty">
                    No payment proof uploaded.
                </div>

                <div class="payment-detail-card__verification-details">
                    <h4 class="payment-detail-card__subsection-title">Verification Details</h4>
                    <div class="payment-detail-card__field">
                        <span>Verified By</span>
                        <strong>{{ verifiedBy }}</strong>
                    </div>
                    <div class="payment-detail-card__field">
                        <span>Verified Date</span>
                        <strong>{{ verifiedDate }}</strong>
                    </div>
                </div>
            </div>

            <div class="payment-detail-card__admin-remark">
                <span class="payment-detail-card__label">Admin Remark</span>
                <p>{{ adminRemarkDisplay }}</p>
            </div>
        </div>
    </section>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import StatusBadge from '@/components/global/StatusBadge.vue';

export default defineComponent({
    name: 'PaymentDetailCard',
    components: {
        Button,
        Textarea,
        StatusBadge,
    },
    props: {
        mode: {
            type: String,
            default: 'detail',
            validator: (value) => ['detail', 'approval'].includes(value),
        },
        paymentId: { type: String, default: '—' },
        submittedAt: { type: String, default: '—' },
        status: { type: String, default: '' },
        showStatus: { type: Boolean, default: false },
        invoiceNumber: { type: String, default: '—' },
        customerName: { type: String, default: '—' },
        buildingName: { type: String, default: '—' },
        roomNumber: { type: String, default: '—' },
        paymentDate: { type: String, default: '—' },
        paymentMethod: { type: String, default: '—' },
        invoiceRows: { type: Array, default: () => [] },
        subTotal: { type: String, default: '—' },
        lateFee: { type: String, default: '—' },
        showLateFee: { type: Boolean, default: false },
        showLateFeeHint: { type: Boolean, default: true },
        total: { type: String, default: '—' },
        receivedLabel: { type: String, default: 'Amount Received' },
        received: { type: String, default: '—' },
        changeLabel: { type: String, default: 'Change' },
        change: { type: String, default: '—' },
        showChange: { type: Boolean, default: false },
        balance: { type: String, default: '—' },
        proofPreview: { type: String, default: '' },
        verifiedBy: { type: String, default: '—' },
        verifiedDate: { type: String, default: '—' },
        adminRemarkDisplay: { type: String, default: '—' },
        adminRemark: { type: String, default: '' },
        canReview: { type: Boolean, default: false },
        approving: { type: Boolean, default: false },
        rejecting: { type: Boolean, default: false },
        approveDisabled: { type: Boolean, default: false },
    },
    emits: ['update:adminRemark', 'preview-proof', 'approve', 'reject'],
});
</script>

<style scoped>
.payment-detail-card {
    padding: 1.25rem 1.35rem 1.5rem;
}

.payment-detail-card__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem 1.25rem;
}

.payment-detail-card__payment-id {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.35;
}

.payment-detail-card__head-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.55rem 0.85rem;
}

.payment-detail-card__datetime {
    color: var(--admin-text-muted);
    font-size: 0.875rem;
}

.payment-detail-card__divider {
    margin: 1rem 0;
    border-top: 1px solid var(--admin-border);
}

.payment-detail-card__info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem 2.5rem;
}

.payment-detail-card__info-col {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.payment-detail-card__field {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
}

.payment-detail-card__field span,
.payment-detail-card__label {
    color: var(--admin-text-muted);
    font-size: 0.75rem;
    font-weight: 500;
}

.payment-detail-card__field strong {
    color: var(--admin-text);
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.45;
    overflow-wrap: anywhere;
}

.payment-detail-card__section-title {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 600;
}

.payment-detail-card__subsection-title {
    margin: 0 0 0.65rem;
    font-size: 0.9375rem;
    font-weight: 600;
}

.payment-detail-card__table-wrap {
    overflow-x: auto;
}

.payment-detail-card__table {
    width: 100%;
    min-width: 40rem;
    border-collapse: collapse;
}

.payment-detail-card__table th,
.payment-detail-card__table td {
    padding: 0.65rem 0.5rem;
    border-bottom: 1px solid var(--admin-border);
    font-size: 0.875rem;
    text-align: left;
    vertical-align: top;
}

.payment-detail-card__table th {
    color: var(--admin-text-muted);
    font-weight: 600;
    white-space: nowrap;
}

.payment-detail-card__table .is-center {
    text-align: center;
}

.payment-detail-card__table .is-num {
    text-align: right;
    white-space: nowrap;
}

.payment-detail-card__table .is-empty {
    color: var(--admin-text-muted);
    text-align: center;
}

.payment-detail-card__totals-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
}

.payment-detail-card__late-fee-hint {
    margin: 0;
    max-width: 16rem;
    color: var(--admin-text-muted);
    font-size: 0.75rem;
    line-height: 1.4;
}

.payment-detail-card__totals {
    margin: 0 0 0 auto;
    min-width: min(100%, 16rem);
    display: grid;
    gap: 0.45rem;
}

.payment-detail-card__totals > div {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1.25rem;
    align-items: baseline;
}

.payment-detail-card__totals dt,
.payment-detail-card__totals dd {
    margin: 0;
    font-size: 0.875rem;
}

.payment-detail-card__totals dd {
    text-align: right;
    white-space: nowrap;
}

.payment-detail-card__totals .is-total dt,
.payment-detail-card__totals .is-total dd {
    font-weight: 700;
}

.payment-detail-card__totals .is-separator {
    padding-top: 0.55rem;
    margin-top: 0.15rem;
    border-top: 1px solid var(--admin-border);
}

.payment-detail-card__verification-grid,
.payment-detail-card__proof-view-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 1.25rem;
    align-items: start;
}

.payment-detail-card__label {
    display: block;
    margin: 0 0 0.45rem;
}

.payment-detail-card__proof {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 12rem;
    margin: 0;
    padding: 0.75rem;
    border: 1px dashed var(--admin-border);
    border-radius: 0.5rem;
    background: color-mix(in srgb, var(--admin-border) 14%, transparent);
    cursor: zoom-in;
}

.payment-detail-card__proof.is-empty {
    cursor: default;
    color: var(--admin-text-muted);
    font-size: 0.875rem;
    text-align: center;
}

.payment-detail-card__proof img {
    max-height: 16rem;
    max-width: 100%;
    object-fit: contain;
    border-radius: 0.35rem;
}

.payment-detail-card__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.65rem;
    margin-top: 1.25rem;
}

.payment-detail-card__reject-hint {
    color: var(--admin-text-muted);
    font-size: 0.75rem;
}

.payment-detail-card__admin-remark {
    margin-top: 1rem;
}

.payment-detail-card__admin-remark p {
    margin: 0;
    color: var(--admin-text);
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-line;
}

@media (max-width: 767px) {
    .payment-detail-card__info-grid,
    .payment-detail-card__verification-grid,
    .payment-detail-card__proof-view-grid {
        grid-template-columns: minmax(0, 1fr);
    }

    .payment-detail-card__totals {
        margin-left: 0;
        width: 100%;
    }

    .payment-detail-card__actions {
        justify-content: stretch;
    }
}
</style>
