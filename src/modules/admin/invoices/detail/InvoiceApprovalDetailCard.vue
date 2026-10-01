<template>
    <section class="admin-panel invoice-approval-detail-card">
        <div class="invoice-approval-detail-card__head">
            <div class="invoice-approval-detail-card__id-row">
                <h2 class="invoice-approval-detail-card__title">{{ form.invoice_number || '—' }}</h2>
            </div>
            <span class="invoice-approval-detail-card__meta">
                {{ billingPeriodLabel }}
            </span>
        </div>
        <div class="invoice-approval-detail-card__divider">
            <div class="invoice-approval-detail-card__divider-line"></div>
        </div>

        <div class="invoice-approval-detail-card__section invoice-approval-detail-card__summary-grid">
            <div class="invoice-approval-detail-card__field">
                <span>Billing Period</span>
                <strong>{{ formatMonth(form.billing_month) }}</strong>
            </div>
            <div class="invoice-approval-detail-card__field">
                <label for="invoice-approval-due-date">Due Date</label>
                <Calendar
                    id="invoice-approval-due-date"
                    v-model="form.due_date"
                    date-format="dd M yy"
                    show-icon
                    class="w-full"
                    :disabled="disabled"
                />
                <small v-if="errors.due_date" class="p-error">{{ errors.due_date }}</small>
            </div>
        </div>

        <div class="invoice-approval-detail-card__section invoice-approval-detail-card__info-grid">
            <div class="invoice-approval-detail-card__info-col">
                <h3 class="invoice-approval-detail-card__section-title">Customer</h3>
                <div class="invoice-approval-detail-card__field">
                    <span>Customer</span>
                    <strong>{{ form.customer_name || '—' }}</strong>
                </div>
                <div class="invoice-approval-detail-card__field">
                    <span>Email</span>
                    <strong>{{ form.customer_email || '—' }}</strong>
                </div>
                <div class="invoice-approval-detail-card__field">
                    <span>Phone</span>
                    <strong>{{ form.customer_phone || '—' }}</strong>
                </div>
            </div>

            <div class="invoice-approval-detail-card__info-col">
                <h3 class="invoice-approval-detail-card__section-title">Property</h3>
                <div class="invoice-approval-detail-card__field">
                    <span>Building</span>
                    <strong>{{ form.building_name || '—' }}</strong>
                </div>
                <div class="invoice-approval-detail-card__field">
                    <span>Room</span>
                    <strong>{{ form.room_number || '—' }}</strong>
                </div>
            </div>
        </div>

        <div class="invoice-approval-detail-card__section">
            <h3 class="invoice-approval-detail-card__section-title">Invoice Items</h3>
            <div class="invoice-approval-detail-card__table-wrap">
                <table class="invoice-approval-detail-card__table">
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
                        <tr v-for="(item, index) in form.items" :key="item.id || index">
                            <td>{{ item.description || '—' }}</td>
                            <td class="is-center">
                                <span v-if="item.is_metered">{{ formatNumber(item.previous_reading) }}</span>
                                <span v-else>—</span>
                            </td>
                            <td class="is-center">
                                <InputNumber
                                    v-if="item.is_metered"
                                    v-model="item.current_reading"
                                    class="w-full invoice-approval-detail-card__cell-input"
                                    :disabled="disabled"
                                    :max-fraction-digits="2"
                                    @update:model-value="onItemChange(item)"
                                />
                                <span v-else>—</span>
                            </td>
                            <td class="is-center">
                                <span v-if="item.is_metered">{{ formatNumber(item.usage) }}</span>
                                <span v-else>—</span>
                            </td>
                            <td class="is-num">
                                <InputNumber
                                    v-model="item.unit_price"
                                    class="w-full invoice-approval-detail-card__cell-input"
                                    :disabled="disabled"
                                    :min="0"
                                    :max-fraction-digits="2"
                                    @update:model-value="onItemChange(item)"
                                />
                            </td>
                            <td class="is-num">{{ formatMoney(item.amount) }}</td>
                        </tr>
                        <tr v-if="!form.items.length">
                            <td colspan="6" class="is-empty">No invoice charges recorded.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <small v-if="errors.items" class="p-error">{{ errors.items }}</small>
        </div>

        <div class="invoice-approval-detail-card__section invoice-approval-detail-card__notes-summary">
            <div class="invoice-approval-detail-card__notes-col">
                <h3 class="invoice-approval-detail-card__section-title">Notes</h3>
                <p class="invoice-approval-detail-card__notes-text">
                    Please reference {{ form.invoice_number || 'this invoice' }} when making payment.
                    Payment is due by the due date. Late fees may apply after the due date.
                </p>

                <div class="invoice-approval-detail-card__field invoice-approval-detail-card__late-fee-rule">
                    <label for="invoice-approval-late-fee-rule">Late Fee Rule</label>
                    <Dropdown
                        id="invoice-approval-late-fee-rule"
                        :model-value="lateFeeSelection"
                        :options="lateFeeRuleOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select Late Fee Rule"
                        class="w-full"
                        :disabled="disabled"
                        @update:model-value="$emit('update:lateFeeSelection', $event)"
                    />
                    <small v-if="errors.late_fee_selection" class="p-error">
                        {{ errors.late_fee_selection }}
                    </small>
                </div>
            </div>

            <div class="invoice-approval-detail-card__summary-col">
                <dl class="invoice-approval-detail-card__totals">
                    <div>
                        <dt>Subtotal</dt>
                        <dd>{{ formatMoney(subtotal) }}</dd>
                    </div>
                    <div>
                        <dt>Late Fee</dt>
                        <dd>{{ formatMoney(form.late_fee || 0) }}</dd>
                    </div>
                    <div class="is-section">
                        <dt>Total</dt>
                        <dd>{{ formatMoney(displayTotal) }}</dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="invoice-approval-detail-card__section invoice-approval-detail-card__field">
            <label for="invoice-approval-admin-remark">Admin Remark</label>
            <Textarea
                id="invoice-approval-admin-remark"
                :model-value="adminRemark"
                class="w-full"
                rows="4"
                placeholder="Optional internal remark..."
                :disabled="disabled"
                @update:model-value="$emit('update:adminRemark', $event)"
            />
        </div>

        <div class="invoice-approval-detail-card__section invoice-approval-detail-card__actions">
            <Button
                :label="disabled ? 'Confirming...' : 'Confirm'"
                icon="pi pi-check"
                :loading="disabled"
                :disabled="disabled"
                @click="$emit('confirm')"
            />
        </div>
    </section>
</template>

<script>
import { computed, defineComponent } from 'vue';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Dropdown from '@/components/global/AppDropdown.vue';
import { formatCurrencyAmount } from '@/utils/formatter';
import { recalculateInvoiceItem } from './useInvoiceApprovalReviewForm';

function roundMoney(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export default defineComponent({
    name: 'InvoiceApprovalDetailCard',
    components: {
        Button,
        Calendar,
        InputNumber,
        Textarea,
        Dropdown,
    },
    props: {
        form: { type: Object, required: true },
        errors: { type: Object, default: () => ({}) },
        lateFeeRuleOptions: { type: Array, default: () => [] },
        lateFeeSelection: { type: [Number, String], default: null },
        adminRemark: { type: String, default: '' },
        disabled: { type: Boolean, default: false },
    },
    emits: [
        'update:lateFeeSelection',
        'update:adminRemark',
        'confirm',
    ],
    setup(props) {
        const subtotal = computed(() => roundMoney(
            (props.form.items || []).reduce((sum, item) => sum + Number(item.amount || 0), 0),
        ));

        const displayTotal = computed(() => roundMoney(
            subtotal.value + Number(props.form.late_fee || 0),
        ));

        const billingPeriodLabel = computed(() => {
            const value = props.form.billing_month;
            if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
                return 'Awaiting confirmation';
            }
            return value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        });

        const onItemChange = (item) => {
            recalculateInvoiceItem(item);
        };

        const formatMoney = (value) => {
            if (value === null || value === undefined || value === '') {
                return '—';
            }
            return formatCurrencyAmount(value);
        };

        const formatNumber = (value) => {
            if (value === null || value === undefined || value === '') {
                return '—';
            }
            return Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
        };

        const formatMonth = (value) => {
            if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
                return '—';
            }
            return value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        };

        return {
            subtotal,
            displayTotal,
            billingPeriodLabel,
            onItemChange,
            formatMoney,
            formatNumber,
            formatMonth,
        };
    },
});
</script>

<style scoped>
.invoice-approval-detail-card {
    padding: 1.25rem 1.35rem 1.5rem;
}

.invoice-approval-detail-card__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem 1.25rem;
}

.invoice-approval-detail-card__id-row {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.65rem 0.85rem;
    min-width: 0;
}

.invoice-approval-detail-card__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.35;
}

.invoice-approval-detail-card__meta {
    color: var(--admin-text-muted);
    font-size: 0.875rem;
    font-weight: 400;
}


.invoice-approval-detail-card__divider {
    margin: 1rem 0;
    border-top: 1px solid color-mix(in srgb, var(--admin-border) 55%, transparent);
}
.invoice-approval-detail-card__section {
    margin-top: 1.75rem;
}

.invoice-approval-detail-card__summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem 1.5rem;
}

.invoice-approval-detail-card__info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem 2.5rem;
}

.invoice-approval-detail-card__info-col {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
}

.invoice-approval-detail-card__section-title {
    margin: 0 0 0.15rem;
    color: var(--admin-text);
    font-size: 0.95rem;
    font-weight: 600;
}

.invoice-approval-detail-card__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
}

.invoice-approval-detail-card__field span,
.invoice-approval-detail-card__field label {
    color: var(--admin-text-muted);
    font-size: 0.75rem;
    font-weight: 400;
}

.invoice-approval-detail-card__field strong {
    color: var(--admin-text);
    font-size: 0.9375rem;
    font-weight: 400;
    overflow-wrap: anywhere;
}

.invoice-approval-detail-card__notes-text {
    margin: 0;
    color: var(--admin-text);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
}

.invoice-approval-detail-card__table-wrap {
    width: 100%;
    overflow-x: auto;
}

.invoice-approval-detail-card__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
}

.invoice-approval-detail-card__table th,
.invoice-approval-detail-card__table td {
    padding: 0.65rem 0.5rem;
    text-align: left;
    vertical-align: middle;
    font-size: 0.875rem;
    font-weight: 400;
}

.invoice-approval-detail-card__table th {
    color: var(--admin-text-muted);
    border-bottom: 1px solid color-mix(in srgb, var(--admin-border) 45%, transparent);
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid color-mix(in srgb, var(--admin-border) 45%, transparent);
}

.invoice-approval-detail-card__table td {
    border-bottom: 1px solid color-mix(in srgb, var(--admin-border) 28%, transparent);
}

.invoice-approval-detail-card__table .is-center {
    text-align: center;
}

.invoice-approval-detail-card__table .is-num {
    text-align: right;
    white-space: nowrap;
}

.invoice-approval-detail-card__table .is-empty {
    color: var(--admin-text-muted);
    text-align: center;
}

.invoice-approval-detail-card__cell-input :deep(.p-inputnumber-input),
.invoice-approval-detail-card :deep(.p-inputtext),
.invoice-approval-detail-card :deep(.p-inputtextarea),
.invoice-approval-detail-card :deep(.p-dropdown-label),
.invoice-approval-detail-card :deep(.p-calendar .p-inputtext) {
    font-weight: 400;
}

.invoice-approval-detail-card__cell-input :deep(.p-inputnumber-input) {
    width: 100%;
    text-align: inherit;
}

.invoice-approval-detail-card__notes-summary {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(12rem, 0.95fr);
    gap: 1.25rem 2.5rem;
    align-items: start;
}

.invoice-approval-detail-card__notes-col {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
}

.invoice-approval-detail-card__late-fee-rule {
    margin-top: 0.35rem;
}

.invoice-approval-detail-card__summary-col {
    display: flex;
    justify-content: flex-end;
    min-width: 0;
}

.invoice-approval-detail-card__totals {
    margin: 0;
    width: 100%;
    max-width: 16rem;
}

.invoice-approval-detail-card__totals > div {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0.35rem 0;
}

.invoice-approval-detail-card__totals dt,
.invoice-approval-detail-card__totals dd {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 400;
}

.invoice-approval-detail-card__totals dd {
    text-align: right;
    border-top: 1px solid color-mix(in srgb, var(--admin-border) 40%, transparent);
    white-space: nowrap;
}

.invoice-approval-detail-card__totals .is-section {
    margin-top: 0.35rem;
    padding-top: 0.55rem;
    border-top: 1px solid color-mix(in srgb, var(--admin-border) 40%, transparent);
}

.invoice-approval-detail-card__totals .is-section dt {
    font-size: 0.95rem;
    font-weight: 500;
}

.invoice-approval-detail-card__totals .is-section dd {
    font-size: 0.95rem;
    font-weight: 600;
}

.invoice-approval-detail-card__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
}

@media (max-width: 900px) {
    .invoice-approval-detail-card__summary-grid,
    .invoice-approval-detail-card__info-grid,
    .invoice-approval-detail-card__notes-summary {
        grid-template-columns: 1fr;
    }

    .invoice-approval-detail-card__summary-col {
        justify-content: stretch;
    }

    .invoice-approval-detail-card__totals {
        max-width: none;
    }

    .invoice-approval-detail-card__actions {
        justify-content: stretch;
    }

    .invoice-approval-detail-card__actions :deep(.p-button) {
        width: 100%;
    }
}
</style>
