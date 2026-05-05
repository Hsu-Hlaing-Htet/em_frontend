<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getOwnerReceipt } from '@/modules/user/userService';

const route = useRoute();
const receipt = ref(null);

onMounted(async () => {
    const { data } = await getOwnerReceipt(route.params.id);
    receipt.value = data;
});
</script>

<template>
    <div v-if="receipt" class="rr-card" style="padding: 1rem; max-width: 760px">
        <p class="rr-title" style="font-size: 0.75rem">Receipt Detail</p>
        <h2 style="margin-top: 0.3rem">{{ receipt.receipt_number }}</h2>
        <p class="rr-muted">Invoice: {{ receipt.invoice?.invoice_number }}</p>
        <p class="rr-muted">Property: {{ receipt.invoice?.property?.property_name || '-' }}</p>
        <p class="rr-muted">Payment Date: {{ receipt.payment?.payment_date }}</p>
        <p class="rr-muted">Issued Date: {{ receipt.issued_date }}</p>
        <p class="rr-muted">Amount: {{ receipt.amount }}</p>
        <p class="rr-muted">Reference: {{ receipt.payment?.reference_note || '-' }}</p>
        <PvButton label="Download (Demo)" style="margin-top: 0.8rem" />
    </div>
</template>
