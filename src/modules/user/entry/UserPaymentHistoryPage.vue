<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getOwnerPayments } from '@/modules/user/service';

const router = useRouter();
const payments = ref([]);

onMounted(async () => {
    const { data } = await getOwnerPayments();
    payments.value = data.data;
});
</script>

<template>
    <div class="rr-card" style="padding: 0.5rem">
        <PvDataTable :value="payments" class="rr-table-clean" responsive-layout="scroll">
            <PvColumn field="payment_date" header="Date" />
            <PvColumn field="amount" header="Amount" />
            <PvColumn field="payment_method" header="Method" />
            <PvColumn field="reference_note" header="Reference" />
            <PvColumn header="Receipt">
                <template #body="slotProps">
                    <PvButton
                        v-if="slotProps.data.receipt"
                        label="View"
                        size="small"
                        outlined
                        severity="secondary"
                        @click="router.push(`/user/receipts/${slotProps.data.receipt.id}`)"
                    />
                </template>
            </PvColumn>
        </PvDataTable>
    </div>
</template>
