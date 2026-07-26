<template>
    <div v-if="!isLoading">
        <div class="mb-4 flex flex-wrap gap-2">
            <Button
                label="Download Invoice"
                icon="pi pi-download"
                class="flex-1"
                :loading="isDownloading"
                @click="downloadPdf"
            />
            <router-link :to="{ name: 'customerInvoiceList' }" class="flex-1">
                <Button label="Back" severity="secondary" class="customer-btn-block" />
            </router-link>
        </div>

        <div class="admin-panel mb-4 p-4">
            <div class="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p class="m-0 text-sm text-[var(--admin-text-muted)]">Invoice</p>
                    <h1 class="customer-page-heading m-0">{{ state.invoice_number }}</h1>
                    <p class="m-0 mt-1 text-sm text-[var(--admin-text-muted)]">
                        {{ state.building_name }} · Room {{ state.room_number || '—' }}
                    </p>
                </div>
                <StatusBadge :value="state.status" />
            </div>

            <div class="customer-detail-grid">
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Total</p>
                    <p class="customer-detail-value">{{ formatCurrency(state.total_amount) }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Paid</p>
                    <p class="customer-detail-value">{{ formatCurrency(state.paid_amount) }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Remaining</p>
                    <p class="customer-detail-value">{{ formatCurrency(remainingAmount) }}</p>
                </div>
                <div class="customer-detail-item">
                    <p class="customer-detail-label">Due Date</p>
                    <p class="customer-detail-value">{{ state.due_date || '—' }}</p>
                </div>
            </div>
        </div>

        <section class="customer-section">
            <h2 class="customer-section-title">Line Items</h2>
            <div class="admin-panel p-4">
                <div v-for="item in invoiceItems" :key="item.id" class="customer-line-item">
                    <div>
                        <p class="m-0 font-semibold">{{ item.description }}</p>
                        <p class="m-0 text-sm text-[var(--admin-text-muted)]">{{ item.charge_type_name || 'Charge' }}</p>
                    </div>
                    <strong>{{ formatCurrency(item.amount) }}</strong>
                </div>
                <CustomerEmptyState
                    v-if="!invoiceItems.length"
                    icon="pi pi-list"
                    title="No line items"
                    message="This invoice has no itemized charges."
                />
            </div>
        </section>

        <section class="customer-section">
            <h2 class="customer-section-title">Payment History</h2>
            <div v-if="invoicePayments.length" class="customer-list-stack">
                <CustomerTransactionCard
                    v-for="payment in invoicePayments"
                    :key="payment.id"
                    :transaction-id="payment.payment_number"
                    :title="payment.payment_method_name || 'Payment'"
                    :amount="payment.amount"
                    :subtitle="payment.payment_date || '—'"
                    :status="payment.status"
                    @select="openReceipt(payment.receipt_id)"
                />
            </div>
            <CustomerEmptyState
                v-else
                icon="pi pi-history"
                title="No payments yet"
                message="Submitted payments for this invoice will appear here."
            />
        </section>

        <section v-if="canPay" class="customer-section">
            <h2 class="customer-section-title">Pay Invoice</h2>
            <form class="admin-panel p-4" @submit.prevent="submitPayment">
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Payment Method</label>
                        <Dropdown
                            v-model="paymentForm.payment_method_id"
                            :options="paymentMethods"
                            option-label="label"
                            option-value="value"
                            placeholder="Select method"
                            class="w-full"
                        />
                        <small v-if="errors.has('payment_method_id')" class="p-error">
                            <div v-for="error in errors.get('payment_method_id')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Amount</label>
                        <InputNumber v-model="paymentForm.amount" class="w-full" :min="0.01" />
                        <small class="text-[var(--admin-text-muted)]">Remaining: {{ formatCurrency(remainingAmount) }}</small>
                        <small v-if="errors.has('amount')" class="p-error">
                            <div v-for="error in errors.get('amount')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Payment Date</label>
                        <Calendar v-model="paymentForm.payment_date" date-format="yy-mm-dd" class="w-full" show-icon />
                        <small v-if="errors.has('payment_date')" class="p-error">
                            <div v-for="error in errors.get('payment_date')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Note</label>
                        <Textarea v-model="paymentForm.note" rows="3" class="w-full" />
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Payment Proof</label>
                        <FileUpload
                            mode="basic"
                            choose-label="Upload Proof"
                            accept="image/*,application/pdf"
                            :auto="false"
                            custom-upload
                            @select="onProofSelected"
                        />
                        <small v-if="errors.has('proof')" class="p-error">
                            <div v-for="error in errors.get('proof')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <Button type="submit" label="Submit Payment" class="customer-btn-block" :loading="isSaving" />
                </div>
            </form>
        </section>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import StatusBadge from '@/components/global/StatusBadge.vue';
import Loading from '@/components/global/Loading.vue';
import CustomerTransactionCard from '@/components/customer/CustomerTransactionCard.vue';
import CustomerEmptyState from '@/components/customer/CustomerEmptyState.vue';
import { formatCurrency } from '@/utils/formatter';
import useCustomerShowInvoice from '@/composables/customer/useCustomerShowInvoice';

export default defineComponent({
    name: 'CustomerShowInvoice',
    components: {
        Button,
        Dropdown,
        InputNumber,
        Textarea,
        FileUpload,
        StatusBadge,
        Loading,
        CustomerTransactionCard,
        CustomerEmptyState,
    },
    setup() {
        const router = useRouter();
        const invoice = useCustomerShowInvoice();

        const openReceipt = (receiptId) => {
            if (receiptId) {
                router.push({ name: 'customerShowReceipt', params: { id: receiptId } });
            }
        };

        return {
            ...invoice,
            formatCurrency,
            openReceipt,
        };
    },
});
</script>
