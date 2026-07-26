<template>
    <div class="payment-detail-page">
        <div class="flex flex-wrap items-center justify-between gap-3 p-4">
            <WorkflowActionBar
                :can-approve="canApprove()"
                :can-reject="canReject()"
                :approving="workflowLoading.approve"
                :rejecting="workflowLoading.reject"
                approve-label="Approve Payment"
                reject-label="Reject Payment"
                @approve="runWorkflow('approve')"
                @reject="runWorkflow('reject')"
            />
            <div class="flex flex-wrap items-center gap-2">
                <router-link
                    v-if="documentRoute"
                    :to="documentRoute"
                >
                    <Button
                        icon="pi pi-file"
                        label="View Document"
                        severity="secondary"
                    />
                </router-link>
                <router-link
                    v-if="receiptRoute"
                    :to="receiptRoute"
                >
                    <Button
                        icon="pi pi-receipt"
                        label="View Receipt"
                        severity="secondary"
                    />
                </router-link>
                <router-link :to="backRoute">
                    <Button label="Back" />
                </router-link>
            </div>
        </div>

        <div v-if="!isLoading" class="payment-detail-shell mx-auto max-w-4xl px-4 pb-8">
            <section class="admin-panel payment-detail-panel">
                <div class="payment-detail-header">
                    <p class="payment-detail-eyebrow">Payment Detail</p>
                    <h2 class="m-0 text-xl font-semibold text-rosewood">
                        {{ state.payment_number }}
                    </h2>
                </div>

                <div class="payment-detail-meta">
                    <dl class="payment-detail-meta__group">
                        <div class="payment-detail-list__row">
                            <dt class="payment-detail-list__label">Customer Name</dt>
                            <dd class="payment-detail-list__value">{{ state.customer_name || '—' }}</dd>
                        </div>
                        <div class="payment-detail-list__row">
                            <dt class="payment-detail-list__label">Property / Unit</dt>
                            <dd class="payment-detail-list__value">{{ propertyUnit }}</dd>
                        </div>
                    </dl>

                    <dl class="payment-detail-meta__group">
                        <div class="payment-detail-list__row">
                            <dt class="payment-detail-list__label">Created By</dt>
                            <dd class="payment-detail-list__value">{{ state.created_by_name || '—' }}</dd>
                        </div>
                        <div class="payment-detail-list__row">
                            <dt class="payment-detail-list__label">Created At</dt>
                            <dd class="payment-detail-list__value">{{ formattedCreatedAt }}</dd>
                        </div>
                    </dl>
                </div>

                <div class="payment-detail-divider" />

                <h3 class="payment-detail-section-title">Payment Information</h3>
                <div class="payment-detail-table-wrap">
                    <table class="payment-detail-table">
                        <thead>
                            <tr>
                                <th>Invoice No</th>
                                <th>Payment Date</th>
                                <th>Payment Method</th>
                                <th class="payment-detail-table__numeric">Paid Amount</th>
                                <th>Reference No</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <router-link
                                        v-if="invoiceRoute"
                                        :to="invoiceRoute"
                                        class="payment-detail-link"
                                    >
                                        {{ state.invoice_number || '—' }}
                                    </router-link>
                                    <span v-else>{{ state.invoice_number || '—' }}</span>
                                </td>
                                <td>{{ state.payment_date || '—' }}</td>
                                <td>{{ state.payment_method_name || '—' }}</td>
                                <td class="payment-detail-table__numeric">
                                    {{ formatCurrency(state.amount) }}
                                </td>
                                <td>{{ state.reference_number || state.payment_number || '—' }}</td>
                                <td><StatusBadge :value="paymentStatus" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="payment-detail-divider" />

                <h3 class="payment-detail-section-title">Proof of Payment</h3>
                <div v-if="proofPreview" class="mb-4">
                    <img
                        :src="proofPreview"
                        alt="Payment proof"
                        class="max-h-80 rounded border border-[var(--admin-border)]"
                    >
                </div>
                <FileUpload
                    mode="basic"
                    choose-label="Upload Proof"
                    accept="image/*"
                    :auto="true"
                    :disabled="isUploading"
                    custom-upload
                    @select="onProofSelect"
                />

                <div
                    v-if="state.note"
                    class="payment-detail-note"
                >
                    <span class="payment-detail-list__label">Notes</span>
                    <p class="payment-detail-note__value">{{ state.note }}</p>
                </div>
            </section>
        </div>

        <Loading v-if="isLoading || isUploading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import WorkflowActionBar from '@/components/admin/WorkflowActionBar.vue';
import useShowPayment from './useShowPayment';

export default defineComponent({
    name: 'ShowPayment',
    components: { FileUpload, Button, Loading, StatusBadge, WorkflowActionBar },
    setup() {
        return useShowPayment();
    },
});
</script>

<style scoped>
.payment-detail-page {
    min-height: 100%;
}

.payment-detail-shell {
    display: flex;
    flex-direction: column;
}

.payment-detail-panel {
    padding: 1.25rem;
}

.payment-detail-header {
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--admin-border);
}

.payment-detail-eyebrow {
    margin: 0 0 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--admin-text-muted);
}

.payment-detail-meta {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
}

@media (min-width: 768px) {
    .payment-detail-meta {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
}

.payment-detail-meta__group {
    margin: 0;
}

.payment-detail-list__row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--admin-border);
}

@media (min-width: 640px) {
    .payment-detail-list__row {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1.5rem;
    }
}

.payment-detail-list__label {
    flex-shrink: 0;
    min-width: 7rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--admin-text-muted);
}

.payment-detail-list__value {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--admin-text);
    line-height: 1.5;
    text-align: left;
    word-break: break-word;
}

@media (min-width: 640px) {
    .payment-detail-list__value {
        text-align: right;
    }
}

.payment-detail-divider {
    margin: 1.25rem 0;
    border-top: 1px solid var(--admin-border);
}

.payment-detail-section-title {
    margin: 0 0 1rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--admin-text);
}

.payment-detail-table-wrap {
    overflow-x: auto;
}

.payment-detail-table {
    width: 100%;
    min-width: 40rem;
    border-collapse: collapse;
}

.payment-detail-table th,
.payment-detail-table td {
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid var(--admin-border);
    text-align: left;
    font-size: 0.875rem;
}

.payment-detail-table th {
    color: var(--admin-text-muted);
    font-weight: 600;
    white-space: nowrap;
}

.payment-detail-table__numeric {
    text-align: right;
    white-space: nowrap;
}

.payment-detail-link {
    color: var(--admin-primary);
    font-weight: 600;
    text-decoration: none;
}

.payment-detail-link:hover {
    text-decoration: underline;
}

.payment-detail-note {
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid var(--admin-border);
}

.payment-detail-note__value {
    margin: 0.35rem 0 0;
    font-size: 0.9375rem;
    color: var(--admin-text);
    line-height: 1.5;
}
</style>
