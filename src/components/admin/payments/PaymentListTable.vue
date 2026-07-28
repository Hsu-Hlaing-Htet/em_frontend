<script setup>
import { computed } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { formatPaymentTypeLabel, resolvePaymentListStatus } from '@/helpers/payments/paymentListHelpers';
import { formatCurrency } from '@/utils/formatter';

const props = defineProps({
    items: {
        type: Array,
        default: () => [],
    },
    variant: {
        type: String,
        default: 'dashboard',
        validator: (value) => ['dashboard', 'admin'].includes(value),
    },
    formatDate: {
        type: Function,
        default: (value) => value || '—',
    },
});

const emit = defineEmits(['view', 'edit', 'receipt']);

const rows = computed(() => props.items.map((item) => ({
    ...item,
    display_status: resolvePaymentListStatus(item),
})));

function emitView(item) {
    emit('view', item);
}

function emitEdit(item) {
    emit('edit', item);
}

function emitReceipt(item) {
    emit('receipt', item);
}
</script>

<template>
    <div class="payment-list-table-wrap">
        <table class="payment-list-table" :class="`payment-list-table--${variant}`">
            <thead>
                <tr>
                    <th>Invoice No</th>
                    <th>Customer Name</th>
                    <th>Property/Unit</th>
                    <th>Invoice No</th>
                    <th>Payment Type</th>
                    <th class="payment-list-table__numeric">Invoice Amount</th>
                    <th class="payment-list-table__numeric">Paid Amount</th>
                    <th class="payment-list-table__numeric">Balance</th>
                    <th>Payment Date</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Reference No</th>
                    <th>Notes</th>
                    <th class="payment-list-table__actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="item in rows"
                    :key="item.id"
                >
                    <td>
                        <button
                            v-if="variant === 'dashboard'"
                            type="button"
                            class="payment-list-table__link"
                            @click="emitView(item)"
                        >
                            {{ item.invoice_number || item.payment_id || item.reference || '—' }}
                        </button>
                        <router-link
                            v-else
                            :to="{ name: 'showPayment', params: { id: item.id } }"
                            class="payment-list-table__link"
                        >
                            {{ item.invoice_number || item.payment_id || '—' }}
                        </router-link>
                    </td>
                    <td>{{ item.customer_name || item.client || '—' }}</td>
                    <td>{{ item.property_unit || '—' }}</td>
                    <td>{{ item.invoice_number || item.invoice || '—' }}</td>
                    <td>{{ formatPaymentTypeLabel(item.payment_type) }}</td>
                    <td class="payment-list-table__numeric">{{ formatCurrency(item.invoice_amount) }}</td>
                    <td class="payment-list-table__numeric">{{ formatCurrency(item.paid_amount ?? item.amount) }}</td>
                    <td class="payment-list-table__numeric">{{ formatCurrency(item.balance) }}</td>
                    <td>{{ formatDate(item.payment_date || item.paid_at) }}</td>
                    <td>{{ item.payment_method_name || item.method || '—' }}</td>
                    <td><StatusBadge :value="item.display_status" /></td>
                    <td>{{ item.reference_number || item.invoice_number || item.reference || '—' }}</td>
                    <td class="payment-list-table__notes">{{ item.note || item.notes || '—' }}</td>
                    <td class="payment-list-table__actions">
                        <div class="payment-list-table__action-group">
                            <button
                                v-if="variant === 'dashboard'"
                                type="button"
                                class="payment-list-table__action"
                                @click="emitView(item)"
                            >
                                View
                            </button>
                            <router-link
                                v-else
                                :to="{ name: 'showPayment', params: { id: item.id } }"
                                class="payment-list-table__action"
                            >
                                View
                            </router-link>

                            <router-link
                                v-if="variant !== 'dashboard' && item.status === 'pending'"
                                :to="{ name: 'showPayment', params: { id: item.id } }"
                                class="payment-list-table__action"
                            >
                                Edit
                            </router-link>

                            <router-link
                                v-if="variant !== 'dashboard' && item.receipt_id"
                                :to="{ name: 'showReceipt', params: { id: item.receipt_id } }"
                                class="payment-list-table__action"
                            >
                                Receipt
                            </router-link>
                            <button
                                v-else-if="variant === 'dashboard' && item.receipt_id"
                                type="button"
                                class="payment-list-table__action"
                                @click="emitReceipt(item)"
                            >
                                Receipt
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.payment-list-table-wrap {
    overflow-x: auto;
}

.payment-list-table {
    width: 100%;
    min-width: 72rem;
    border-collapse: collapse;
}

.payment-list-table th,
.payment-list-table td {
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid var(--admin-border);
    text-align: left;
    font-size: 0.875rem;
    vertical-align: top;
}

.payment-list-table th {
    color: var(--admin-text-muted);
    font-weight: 600;
    white-space: nowrap;
}

.payment-list-table__numeric {
    text-align: right;
    white-space: nowrap;
}

.payment-list-table__notes {
    min-width: 10rem;
    max-width: 14rem;
    white-space: normal;
}

.payment-list-table__actions {
    min-width: 9rem;
}

.payment-list-table__action-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.payment-list-table__action,
.payment-list-table__link {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    border: 1px solid var(--admin-border);
    background: var(--admin-surface-solid);
    padding: 0.35rem 0.65rem;
    font-size: 0.75rem;
    color: var(--admin-text);
    text-decoration: none;
    transition: all 0.2s ease;
}

.payment-list-table__link {
    border: none;
    background: transparent;
    padding: 0;
    color: var(--admin-primary);
    font-weight: 600;
    cursor: pointer;
}

.payment-list-table__action:hover,
.payment-list-table__link:hover {
    border-color: color-mix(in srgb, var(--admin-primary) 25%, transparent);
    color: var(--admin-primary);
}

.payment-list-table--dashboard .payment-list-table__link {
    font-weight: 500;
}
</style>
