<template>
    <div class="invoice-detail-page">
        <div class="flex flex-wrap items-center justify-between gap-3 p-4">
            <div class="flex flex-wrap items-center gap-2">
                <Button
                    v-if="canApprove()"
                    label="Approve Invoice"
                    icon="pi pi-check"
                    :loading="isApproving"
                    @click="handleApprove"
                />
                <router-link
                    v-if="canEdit && editRoute"
                    :to="editRoute"
                >
                    <Button
                        icon="pi pi-pencil"
                        label="Edit Invoice"
                        severity="secondary"
                    />
                </router-link>
                <Button
                    icon="pi pi-download"
                    label="Download Invoice"
                    severity="secondary"
                    @click="downloadPdf"
                />
                <Button
                    icon="pi pi-envelope"
                    label="Send Invoice"
                    @click="sendEmail"
                />
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
            </div>
            <router-link :to="backRoute">
                <Button label="Back" />
            </router-link>
        </div>

        <div v-if="!isLoading" class="invoice-detail-shell mx-auto max-w-4xl px-4 pb-8">
            <section class="admin-panel invoice-detail-panel">
                <div class="invoice-detail-header">
                    <p class="invoice-detail-eyebrow">Invoice Detail</p>
                    <h2 class="m-0 text-xl font-semibold text-rosewood">
                        {{ state.invoice_number }}
                    </h2>
                </div>

                <dl class="invoice-detail-list">
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Invoice ID</dt>
                        <dd class="invoice-detail-list__value">{{ state.id || '—' }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Invoice No</dt>
                        <dd class="invoice-detail-list__value">{{ state.invoice_number || '—' }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Customer Name</dt>
                        <dd class="invoice-detail-list__value">{{ state.customer_name || '—' }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Property/Unit</dt>
                        <dd class="invoice-detail-list__value">{{ propertyUnit }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Invoice Type</dt>
                        <dd class="invoice-detail-list__value">{{ invoiceTypeLabel }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Billing Period</dt>
                        <dd class="invoice-detail-list__value">{{ billingPeriod }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Issue Date</dt>
                        <dd class="invoice-detail-list__value">{{ state.issued_date || '—' }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Due Date</dt>
                        <dd class="invoice-detail-list__value">{{ state.due_date || '—' }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Total Amount</dt>
                        <dd class="invoice-detail-list__value invoice-detail-list__value--emphasis">{{ totalDue }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Paid Amount</dt>
                        <dd class="invoice-detail-list__value">{{ paidAmount }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Balance</dt>
                        <dd class="invoice-detail-list__value">{{ remainingBalance }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Status</dt>
                        <dd class="invoice-detail-list__value">
                            <StatusBadge :value="paymentStatus" />
                        </dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Payment Method</dt>
                        <dd class="invoice-detail-list__value">{{ state.payment_method_name || '—' }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Created By</dt>
                        <dd class="invoice-detail-list__value">{{ state.created_by_name || '—' }}</dd>
                    </div>
                    <div class="invoice-detail-list__row">
                        <dt class="invoice-detail-list__label">Created Date</dt>
                        <dd class="invoice-detail-list__value">{{ formattedCreatedAt }}</dd>
                    </div>
                    <div class="invoice-detail-list__row invoice-detail-list__row--stack">
                        <dt class="invoice-detail-list__label">Notes</dt>
                        <dd class="invoice-detail-list__value">{{ invoiceNotes }}</dd>
                    </div>
                </dl>

                <div class="invoice-detail-divider" />

                <h3 class="invoice-detail-section-title">Line Items</h3>
                <div class="invoice-detail-table-wrap">
                    <table class="invoice-detail-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Charge Type</th>
                                <th class="invoice-detail-table__numeric">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="item in state.items"
                                :key="item.id"
                            >
                                <td>{{ item.description || '—' }}</td>
                                <td>{{ item.charge_type_name || '—' }}</td>
                                <td class="invoice-detail-table__numeric">{{ formatCurrency(item.amount) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <template v-if="!isApprovalView">
                    <div class="invoice-detail-divider" />

                    <h3 class="invoice-detail-section-title">Payment History</h3>
                    <div
                        v-if="payments.length"
                        class="invoice-detail-table-wrap"
                    >
                        <table class="invoice-detail-table">
                            <thead>
                                <tr>
                                    <th>Payment ID</th>
                                    <th>Payment Date</th>
                                    <th class="invoice-detail-table__numeric">Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="payment in payments"
                                    :key="payment.id"
                                >
                                    <td>
                                        <router-link
                                            :to="{ name: 'showPayment', params: { id: payment.id } }"
                                            class="invoice-detail-link"
                                        >
                                            {{ payment.payment_number }}
                                        </router-link>
                                    </td>
                                    <td>{{ payment.payment_date || '—' }}</td>
                                    <td class="invoice-detail-table__numeric">{{ formatCurrency(payment.amount) }}</td>
                                    <td>{{ payment.payment_method_name || '—' }}</td>
                                    <td><StatusBadge :value="payment.display_status || payment.status" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p
                        v-else
                        class="m-0 text-sm text-[var(--admin-text-muted)]"
                    >
                        No payments recorded yet.
                    </p>
                </template>
            </section>
        </div>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import useShowInvoice from './useShowInvoice';

export default defineComponent({
    name: 'ShowInvoice',
    components: { Button, Loading, StatusBadge },
    setup() {
        return useShowInvoice();
    },
});
</script>

<style scoped>
.invoice-detail-page {
    min-height: 100%;
}

.invoice-detail-shell {
    display: flex;
    flex-direction: column;
}

.invoice-detail-panel {
    padding: 1.25rem;
}

.invoice-detail-header {
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--admin-border);
}

.invoice-detail-eyebrow {
    margin: 0 0 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--admin-text-muted);
}

.invoice-detail-list {
    margin: 0;
}

.invoice-detail-list__row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--admin-border);
}

@media (min-width: 640px) {
    .invoice-detail-list__row {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1.5rem;
    }

    .invoice-detail-list__row--stack {
        flex-direction: column;
        gap: 0.5rem;
    }
}

.invoice-detail-list__label {
    flex-shrink: 0;
    min-width: 9rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--admin-text-muted);
}

.invoice-detail-list__value {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--admin-text);
    line-height: 1.5;
    text-align: left;
    word-break: break-word;
}

@media (min-width: 640px) {
    .invoice-detail-list__value {
        text-align: right;
    }

    .invoice-detail-list__row--stack .invoice-detail-list__value {
        text-align: left;
    }
}

.invoice-detail-list__value--emphasis {
    font-weight: 600;
    color: var(--admin-primary);
}

.invoice-detail-divider {
    margin: 1.25rem 0;
    border-top: 1px solid var(--admin-border);
}

.invoice-detail-section-title {
    margin: 0 0 1rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--admin-text);
}

.invoice-detail-table-wrap {
    overflow-x: auto;
}

.invoice-detail-table {
    width: 100%;
    min-width: 32rem;
    border-collapse: collapse;
}

.invoice-detail-table th,
.invoice-detail-table td {
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid var(--admin-border);
    text-align: left;
    font-size: 0.875rem;
}

.invoice-detail-table th {
    color: var(--admin-text-muted);
    font-weight: 600;
    white-space: nowrap;
}

.invoice-detail-table__numeric {
    text-align: right;
    white-space: nowrap;
}

.invoice-detail-link {
    color: var(--admin-primary);
    font-weight: 600;
    text-decoration: none;
}

.invoice-detail-link:hover {
    text-decoration: underline;
}
</style>
