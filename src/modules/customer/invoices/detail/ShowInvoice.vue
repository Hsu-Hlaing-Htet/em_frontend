<template>
    <div v-if="!isLoading">
        <div class="mb-10 flex flex-wrap gap-2">
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

        <div class="mx-auto flex max-w-4xl flex-col px-4 pb-8">
            <section class="admin-panel p-5">
                <div class="mb-4 flex items-start justify-between gap-3">
                    <StatusBadge :value="state.status" />
                </div>

                <BillingDetailCustomerSection
                    :name="state.invoice_number"
                    :lines="customerLines"
                    :date="detailDate"
                />

                <BillingDetailTable
                    :columns="invoiceLineItemColumns"
                    :rows="lineItemRows"
                    empty-message="This invoice has no itemized charges."
                    :total-value="formatCurrency(state.total_amount)"
                    min-width="44rem"
                />

                <BillingDetailTable
                    class="mt-8"
                    :columns="customerPaymentColumns"
                    :rows="paymentRows"
                    empty-message="Submitted payments for this invoice will appear here."
                    min-width="36rem"
                >
                    <template #cell-id="{ row }">
                        <button
                            v-if="row.receipt_id"
                            type="button"
                            :class="billingDetailTableClasses.link"
                            @click="openReceipt(row.receipt_id)"
                        >
                            #{{ row.id }}
                        </button>
                        <span v-else>#{{ row.id }}</span>
                    </template>
                    <template #cell-status="{ value }">
                        <StatusBadge :value="value" />
                    </template>
                </BillingDetailTable>

                <p
                    v-if="invoiceSummaryNote"
                    :class="billingDetailTableClasses.summary"
                >
                    {{ invoiceSummaryNote }}
                </p>
            </section>
        </div>

        <section v-if="canPay" class="customer-section mx-auto mt-8 max-w-4xl px-4">
            <h2 class="customer-section-title">Pay Invoice</h2>
            <form class="admin-panel p-5" @submit.prevent="submitPayment">
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
                        <label class="mb-2 block text-sm font-semibold">Payment Date</label>
                        <Calendar v-model="paymentForm.payment_date" date-format="yy-mm-dd" class="w-full" show-icon />
                        <small v-if="errors.has('payment_date')" class="p-error">
                            <div v-for="error in errors.get('payment_date')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Note / Reference</label>
                        <Textarea v-model="paymentForm.note" rows="3" class="w-full" placeholder="Optional bank reference or note" />
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Payment Proof</label>
                        <p class="mb-2 text-sm text-[var(--admin-text-muted)]">
                            After transferring money, upload your payment-proof image. The Admin will verify the paid amount.
                        </p>
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
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Calendar from 'primevue/calendar';
import StatusBadge from '@/components/global/StatusBadge.vue';
import Loading from '@/components/global/Loading.vue';
import BillingDetailCustomerSection from '@/components/billing/BillingDetailCustomerSection.vue';
import BillingDetailTable from '@/components/billing/BillingDetailTable.vue';
import { billingDetailTableClasses } from '@/helpers/billing/billingDetailHelpers';
import { invoiceLineItemColumns } from '@/helpers/billing/billingDetailColumns';
import { mapInvoiceLineItemRow } from '@/helpers/invoices/invoiceDetailHelpers';
import { formatCurrency } from '@/utils/formatter';
import useCustomerShowInvoice from '@/composables/customer/useCustomerShowInvoice';

const customerPaymentColumns = [
    { label: 'Payment ID', key: 'id', align: 'left' },
    { label: 'Payment Date', key: 'payment_date', align: 'left' },
    { label: 'Amount', key: 'amount', align: 'right' },
    { label: 'Method', key: 'payment_method_name', align: 'left' },
    { label: 'Status', key: 'status', align: 'left' },
];

export default defineComponent({
    name: 'CustomerShowInvoice',
    components: {
        Button,
        Dropdown,
        Textarea,
        FileUpload,
        Calendar,
        StatusBadge,
        Loading,
        BillingDetailCustomerSection,
        BillingDetailTable,
    },
    setup() {
        const router = useRouter();
        const invoice = useCustomerShowInvoice();

        const lineItemRows = computed(() => invoice.invoiceItems.map((item) => (
            mapInvoiceLineItemRow(item, formatCurrency)
        )));

        const paymentRows = computed(() => invoice.invoicePayments.map((payment) => ({
            id: payment.id,
            receipt_id: payment.receipt_id,
            payment_date: payment.payment_date,
            amount: payment.amount == null ? 'Pending verification' : formatCurrency(payment.amount),
            payment_method_name: payment.payment_method_name,
            status: payment.status,
        })));

        const openReceipt = (receiptId) => {
            if (receiptId) {
                router.push({ name: 'customerShowReceipt', params: { id: receiptId } });
            }
        };

        return {
            ...invoice,
            invoiceLineItemColumns,
            customerPaymentColumns,
            lineItemRows,
            paymentRows,
            billingDetailTableClasses,
            formatCurrency,
            openReceipt,
        };
    },
});
</script>
