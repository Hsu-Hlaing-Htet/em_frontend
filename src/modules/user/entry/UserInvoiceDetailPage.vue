<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getOwnerInvoice, payOwnerInvoice } from '@/modules/user/service';

const route = useRoute();
const toast = useToast();
const loading = ref(false);
const invoice = ref(null);
const submitting = ref(false);

const paymentForm = reactive({
    payment_date: new Date(),
    amount: null,
    payment_method: 'bank_transfer',
    reference_note: '',
    slip_upload: '',
});

const methodOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Demo Online', value: 'demo_online' },
];

async function load() {
    loading.value = true;

    try {
        const { data } = await getOwnerInvoice(route.params.id);
        invoice.value = data;
    } finally {
        loading.value = false;
    }
}

async function pay() {
    submitting.value = true;

    try {
        await payOwnerInvoice(route.params.id, {
            ...paymentForm,
            payment_date: paymentForm.payment_date.toISOString().slice(0, 10),
        });

        toast.add({ severity: 'success', summary: 'Payment Submitted', detail: 'Payment recorded successfully.', life: 3000 });
        paymentForm.amount = null;
        paymentForm.reference_note = '';
        paymentForm.slip_upload = '';

        await load();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Failed', detail: error.response?.data?.message || 'Unable to submit payment.', life: 3500 });
    } finally {
        submitting.value = false;
    }
}

onMounted(load);
</script>

<template>
    <div v-if="invoice" class="rr-layout-columns">
        <div class="rr-col-8 rr-card" style="padding: 1rem">
            <p class="rr-title" style="font-size: 0.75rem">Invoice Detail</p>
            <h2 style="margin-top: 0.3rem">{{ invoice.invoice_number }}</h2>
            <p class="rr-muted">Property: {{ invoice.property?.property_name || '-' }}</p>
            <p class="rr-muted">Customer: {{ invoice.customer_name }}</p>
            <p class="rr-muted">Due Date: {{ invoice.due_date }}</p>
            <p class="rr-muted">Status: {{ invoice.status }}</p>
            <p class="rr-muted">Total: {{ invoice.total_amount }} · Paid: {{ invoice.paid_amount }}</p>

            <hr class="rr-divider">
            <h3 class="rr-title" style="font-size: 0.72rem">Invoice Items</h3>
            <ul class="rr-muted" style="padding-left: 1rem">
                <li v-for="item in invoice.items" :key="item.id">
                    {{ item.description }} - {{ item.line_total }}
                </li>
            </ul>

            <hr class="rr-divider">
            <h3 class="rr-title" style="font-size: 0.72rem">Payment History</h3>
            <PvDataTable :value="invoice.payments" class="rr-table-clean" responsive-layout="scroll">
                <PvColumn field="payment_date" header="Date" />
                <PvColumn field="amount" header="Amount" />
                <PvColumn field="payment_method" header="Method" />
                <PvColumn header="Receipt">
                    <template #body="slotProps">
                        <router-link v-if="slotProps.data.receipt" :to="`/user/receipts/${slotProps.data.receipt.id}`">
                            <PvButton label="Open" size="small" text />
                        </router-link>
                    </template>
                </PvColumn>
            </PvDataTable>
        </div>

        <div class="rr-col-4 rr-card" style="padding: 1rem">
            <p class="rr-title" style="font-size: 0.75rem">Pay Invoice</p>
            <div class="rr-grid">
                <div>
                    <label class="rr-muted">Payment Date</label>
                    <PvCalendar v-model="paymentForm.payment_date" date-format="yy-mm-dd" style="width: 100%" />
                </div>
                <div>
                    <label class="rr-muted">Amount</label>
                    <PvInputNumber v-model="paymentForm.amount" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
                </div>
                <div>
                    <label class="rr-muted">Method</label>
                    <PvDropdown v-model="paymentForm.payment_method" :options="methodOptions" option-label="label" option-value="value" style="width: 100%" />
                </div>
                <div>
                    <label class="rr-muted">Reference Note</label>
                    <PvInputText v-model="paymentForm.reference_note" style="width: 100%" />
                </div>
                <div>
                    <label class="rr-muted">Slip Upload URL (Demo)</label>
                    <PvInputText v-model="paymentForm.slip_upload" style="width: 100%" />
                </div>
            </div>

            <PvButton :loading="submitting" label="Submit Payment" style="width: 100%; margin-top: 0.8rem" @click="pay" />
        </div>
    </div>

    <div v-if="loading" style="display: grid; place-items: center"><PvProgressSpinner /></div>
</template>
