<template>
    <div v-if="!isLoading" class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div class="admin-panel xl:col-span-2">
            <div class="mb-4 flex flex-wrap justify-end gap-2">
                <Button label="Download PDF" icon="pi pi-download" :loading="isDownloading" @click="downloadPdf" />
                <router-link :to="{ name: 'customerInvoiceList' }">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>

            <h2 class="mb-2 text-xl font-semibold">{{ state.invoice_number }}</h2>
            <p class="mb-4 text-sm text-[var(--text-color-secondary)]">
                {{ state.building_name }} · Room {{ state.room_number || '—' }}
            </p>

            <div class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div><strong>Status</strong><div><StatusBadge :value="state.status" /></div></div>
                <div><strong>Total</strong><div>{{ state.total_amount }}</div></div>
                <div><strong>Paid</strong><div>{{ state.paid_amount }}</div></div>
                <div><strong>Due</strong><div>{{ state.due_date || '—' }}</div></div>
            </div>

            <h3 class="mb-2 font-semibold">Line Items</h3>
            <DataTable :value="invoiceItems" data-key="id" responsive-layout="scroll">
                <Column field="description" header="Description" />
                <Column field="charge_type_name" header="Charge Type" />
                <Column field="amount" header="Amount" />
            </DataTable>

            <h3 class="mb-2 mt-4 font-semibold">Payment History</h3>
            <DataTable :value="invoicePayments" data-key="id" responsive-layout="scroll">
                <Column field="payment_date" header="Date" />
                <Column field="amount" header="Amount" />
                <Column field="payment_method_name" header="Method" />
                <Column field="status" header="Status">
                    <template #body="{ data }">
                        <StatusBadge :value="data.status" />
                    </template>
                </Column>
                <Column header="Receipt">
                    <template #body="{ data }">
                        <router-link
                            v-if="data.receipt_id"
                            :to="{ name: 'customerShowReceipt', params: { id: data.receipt_id } }"
                        >
                            <Button label="View" text size="small" />
                        </router-link>
                        <span v-else>—</span>
                    </template>
                </Column>
            </DataTable>
        </div>

        <div v-if="canPay" class="admin-panel h-fit">
            <h3 class="mb-4 font-semibold">Pay Invoice</h3>
            <form class="flex flex-col gap-3" @submit.prevent="submitPayment">
                <div>
                    <label class="mb-1 block">Payment Method</label>
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
                    <label class="mb-1 block">Amount (Remaining: {{ remainingAmount }})</label>
                    <InputNumber v-model="paymentForm.amount" class="w-full" :min="0.01" />
                    <small v-if="errors.has('amount')" class="p-error">
                        <div v-for="error in errors.get('amount')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div>
                    <label class="mb-1 block">Payment Date</label>
                    <Calendar v-model="paymentForm.payment_date" date-format="yy-mm-dd" class="w-full" show-icon />
                </div>
                <div>
                    <label class="mb-1 block">Note</label>
                    <Textarea v-model="paymentForm.note" rows="3" class="w-full" />
                </div>
                <div>
                    <label class="mb-1 block">Payment Proof</label>
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
                <Button type="submit" label="Submit Payment" :loading="isSaving" />
            </form>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import StatusBadge from '@/components/global/StatusBadge.vue';
import Loading from '@/components/global/Loading.vue';
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
    },
    setup() {
        return useCustomerShowInvoice();
    },
});
</script>
