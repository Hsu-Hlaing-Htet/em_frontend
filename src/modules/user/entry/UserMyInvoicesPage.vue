<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getOwnerInvoices } from '@/modules/user/service';
import StatusBadge from '@/public/components/StatusBadge.vue';

const router = useRouter();
const invoices = ref([]);
const total = ref(0);
const page = ref(1);

async function load() {
    const { data } = await getOwnerInvoices({ page: page.value });

    invoices.value = data.data;
    total.value = data.total;
}

onMounted(load);
</script>

<template>
    <div class="rr-card" style="padding: 0.5rem">
        <PvDataTable :value="invoices" class="rr-table-clean" responsive-layout="scroll">
            <PvColumn field="invoice_number" header="Invoice #" />
            <PvColumn field="customer_name" header="Customer" />
            <PvColumn field="due_date" header="Due Date" />
            <PvColumn field="total_amount" header="Total" />
            <PvColumn field="paid_amount" header="Paid" />
            <PvColumn header="Status">
                <template #body="slotProps">
                    <StatusBadge :value="slotProps.data.status" />
                </template>
            </PvColumn>
            <PvColumn header="Actions">
                <template #body="slotProps">
                    <PvButton label="Detail" outlined severity="secondary" size="small" @click="router.push(`/user/my-invoices/${slotProps.data.id}`)" />
                </template>
            </PvColumn>
        </PvDataTable>

        <div style="padding: 0.75rem; display: flex; justify-content: space-between; align-items: center">
            <small class="rr-muted">Total {{ total }} invoices</small>
            <div style="display: flex; gap: 0.5rem">
                <PvButton :disabled="page <= 1" label="Prev" outlined severity="secondary" @click="page -= 1; load()" />
                <PvButton label="Next" outlined severity="secondary" @click="page += 1; load()" />
            </div>
        </div>
    </div>
</template>
