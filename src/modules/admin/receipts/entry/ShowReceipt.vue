<template>
    <div class="flex flex-wrap items-center justify-between gap-3 p-4">
        <div class="flex gap-2">
            <Button
                v-if="canIssue()"
                label="Issue Receipt"
                icon="pi pi-send"
                :loading="isIssuing"
                @click="handleIssue"
            />
            <a
                v-if="pdfUrl && state.status === 'issued'"
                :href="pdfUrl"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Button label="Download PDF" icon="pi pi-download" severity="secondary" />
            </a>
        </div>
        <router-link :to="{ name: 'receiptList' }">
            <Button label="Back" />
        </router-link>
    </div>

    <div v-if="!isLoading" class="admin-panel mx-auto max-w-4xl">
        <div class="mb-4 flex items-center gap-3">
            <h2 class="m-0 text-lg font-semibold">{{ state.receipt_number }}</h2>
            <StatusBadge :value="state.status" />
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Payment ID</p>
                <p class="text-sm">{{ state.payment_id }}</p>
            </div>
            <div class="p-3">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Issued At</p>
                <p class="text-sm">{{ state.issued_at || '—' }}</p>
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import useShowReceipt from './useShowReceipt';

export default defineComponent({
    name: 'ShowReceipt',
    components: { Button, Loading, StatusBadge },
    setup() {
        return useShowReceipt();
    },
});
</script>
