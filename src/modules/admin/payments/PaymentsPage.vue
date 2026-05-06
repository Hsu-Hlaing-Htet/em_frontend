<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { createAdminInvoicePayment, deleteAdminPayment, getAdminInvoices, getAdminPayments, updateAdminPayment } from '@/modules/admin/service';

const toast = useToast();
const loading = ref(false);
const saving = ref(false);
const showDialog = ref(false);
const page = ref(1);
const total = ref(0);
const payments = ref([]);
const invoices = ref([]);
const editingPayment = ref(null);

const filters = reactive({
    invoice_id: null,
    payment_method: null,
});

const form = reactive({
    invoice_id: null,
    payment_date: new Date(),
    amount: null,
    payment_method: 'cash',
    reference_note: '',
    slip_upload: '',
});

const methodOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Demo Online', value: 'demo_online' },
];

function resetForm() {
    form.invoice_id = null;
    form.payment_date = new Date();
    form.amount = null;
    form.payment_method = 'cash';
    form.reference_note = '';
    form.slip_upload = '';
}

async function loadInvoices() {
    const { data } = await getAdminInvoices({ per_page: 100 });

    invoices.value = data.data.map((invoice) => ({
        ...invoice,
        label: `${invoice.invoice_number} (${invoice.customer_name})`,
    }));
}

async function load() {
    loading.value = true;

    try {
        const { data } = await getAdminPayments({
            page: page.value,
            invoice_id: filters.invoice_id || undefined,
            payment_method: filters.payment_method || undefined,
            per_page: 15,
        });

        payments.value = data.data;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
}

function openCreate() {
    editingPayment.value = null;
    resetForm();
    showDialog.value = true;
}

function openEdit(payment) {
    editingPayment.value = payment;
    form.invoice_id = payment.invoice_id;
    form.payment_date = payment.payment_date ? new Date(payment.payment_date) : new Date();
    form.amount = Number(payment.amount);
    form.payment_method = payment.payment_method;
    form.reference_note = payment.reference_note || '';
    form.slip_upload = payment.slip_upload || '';
    showDialog.value = true;
}

async function submit() {
    saving.value = true;

    try {
        const payload = {
            payment_date: form.payment_date ? form.payment_date.toISOString().slice(0, 10) : null,
            amount: form.amount,
            payment_method: form.payment_method,
            reference_note: form.reference_note,
            slip_upload: form.slip_upload,
        };

        if (editingPayment.value) {
            await updateAdminPayment(editingPayment.value.id, payload);
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Payment updated successfully.', life: 2500 });
        } else {
            if (!form.invoice_id) {
                toast.add({ severity: 'warn', summary: 'Invoice Required', detail: 'Please choose an invoice.', life: 2500 });
                return;
            }

            await createAdminInvoicePayment(form.invoice_id, payload);
            toast.add({ severity: 'success', summary: 'Recorded', detail: 'Payment recorded successfully.', life: 2500 });
        }

        showDialog.value = false;
        await Promise.all([load(), loadInvoices()]);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Payment Error',
            detail: error.response?.data?.message || 'Unable to process payment action.',
            life: 3500,
        });
    } finally {
        saving.value = false;
    }
}

async function remove(payment) {
    if (!window.confirm(`Delete payment #${payment.id}?`)) {
        return;
    }

    try {
        await deleteAdminPayment(payment.id);
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Payment deleted successfully.', life: 2500 });

        if (payments.value.length === 1 && page.value > 1) {
            page.value -= 1;
        }

        await Promise.all([load(), loadInvoices()]);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Delete Failed',
            detail: error.response?.data?.message || 'Unable to delete payment.',
            life: 3500,
        });
    }
}

function formatMoney(value) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(value));
}

function setDialogVisible(value) {
    showDialog.value = value;
}

onMounted(async () => {
    await Promise.all([loadInvoices(), load()]);
});
</script>

<template>
    <div class="rr-card" style="padding: 1rem; margin-bottom: 1rem">
        <div class="rr-layout-columns" style="align-items: end">
            <div class="rr-col-4">
                <label class="rr-muted">Filter by Invoice</label>
                <PvDropdown
                    v-model="filters.invoice_id"
                    :options="invoices"
                    option-label="label"
                    option-value="id"
                    show-clear
                    filter
                    placeholder="All invoices"
                    style="width: 100%"
                />
            </div>
            <div class="rr-col-3">
                <label class="rr-muted">Payment Method</label>
                <PvDropdown
                    v-model="filters.payment_method"
                    :options="[{ label: 'All', value: null }, ...methodOptions]"
                    option-label="label"
                    option-value="value"
                    style="width: 100%"
                />
            </div>
            <div class="rr-col-5" style="display: flex; justify-content: flex-end; gap: 0.5rem">
                <PvButton label="Apply Filter" outlined severity="secondary" @click="page = 1; load()" />
                <PvButton label="Record Payment" @click="openCreate" />
            </div>
        </div>
    </div>

    <div class="rr-card" style="padding: 0.4rem">
        <PvDataTable :value="payments" class="rr-table-clean" :loading="loading" responsive-layout="scroll">
            <PvColumn field="id" header="#" />
            <PvColumn header="Invoice">
                <template #body="slotProps">
                    <div>
                        <strong>{{ slotProps.data.invoice?.invoice_number }}</strong>
                        <div class="rr-muted" style="font-size: 0.82rem">{{ slotProps.data.invoice?.customer_name }}</div>
                    </div>
                </template>
            </PvColumn>
            <PvColumn field="payment_date" header="Date" />
            <PvColumn header="Amount">
                <template #body="slotProps">
                    {{ formatMoney(slotProps.data.amount) }}
                </template>
            </PvColumn>
            <PvColumn field="payment_method" header="Method" />
            <PvColumn field="reference_note" header="Reference" />
            <PvColumn header="Actions" style="width: 180px">
                <template #body="slotProps">
                    <div style="display: flex; gap: 0.35rem">
                        <PvButton icon="pi pi-pencil" text @click="openEdit(slotProps.data)" />
                        <PvButton icon="pi pi-trash" text severity="danger" @click="remove(slotProps.data)" />
                    </div>
                </template>
            </PvColumn>
        </PvDataTable>

        <div style="padding: 0.75rem; display: flex; justify-content: space-between; align-items: center">
            <small class="rr-muted">Total {{ total }} payments</small>
            <div style="display: flex; gap: 0.5rem">
                <PvButton :disabled="page <= 1" label="Prev" outlined severity="secondary" @click="page -= 1; load()" />
                <PvButton label="Next" outlined severity="secondary" @click="page += 1; load()" />
            </div>
        </div>
    </div>

    <PvDialog
        :visible="showDialog"
        :header="editingPayment ? 'Edit Payment' : 'Record Payment'"
        modal
        :style="{ width: 'min(680px, 94vw)' }"
        @update:visible="setDialogVisible"
    >
        <div class="rr-layout-columns">
            <div class="rr-col-12">
                <label class="rr-muted">Invoice</label>
                <PvDropdown
                    v-model="form.invoice_id"
                    :disabled="Boolean(editingPayment)"
                    :options="invoices"
                    option-label="label"
                    option-value="id"
                    filter
                    placeholder="Select invoice"
                    style="width: 100%"
                />
            </div>
            <div class="rr-col-6">
                <label class="rr-muted">Payment Date</label>
                <PvCalendar v-model="form.payment_date" date-format="yy-mm-dd" style="width: 100%" />
            </div>
            <div class="rr-col-6">
                <label class="rr-muted">Amount</label>
                <PvInputNumber v-model="form.amount" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
            </div>
            <div class="rr-col-6">
                <label class="rr-muted">Method</label>
                <PvDropdown v-model="form.payment_method" :options="methodOptions" option-label="label" option-value="value" style="width: 100%" />
            </div>
            <div class="rr-col-6">
                <label class="rr-muted">Reference Note</label>
                <PvInputText v-model="form.reference_note" style="width: 100%" />
            </div>
            <div class="rr-col-12">
                <label class="rr-muted">Slip Upload URL (optional)</label>
                <PvInputText v-model="form.slip_upload" style="width: 100%" />
            </div>
        </div>

        <template #footer>
            <PvButton label="Cancel" outlined severity="secondary" @click="setDialogVisible(false)" />
            <PvButton :loading="saving" :label="editingPayment ? 'Update Payment' : 'Record Payment'" @click="submit" />
        </template>
    </PvDialog>
</template>
