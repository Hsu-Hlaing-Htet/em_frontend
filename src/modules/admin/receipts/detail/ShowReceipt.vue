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
            <router-link
                v-if="documentRoute"
                :to="documentRoute"
            >
                <Button
                    icon="pi pi-file"
                    label="View Document"
                    severity="secondary"
                />
            </router-link>
        </div>
        <router-link :to="backRoute">
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
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Payment</p>
                <p class="text-sm">{{ state.payment_number || '—' }}</p>
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
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import useShowReceipt from './useShowReceipt';

export default defineComponent({
    name: 'ShowReceipt',
    components: { Button, Loading, StatusBadge },
    setup() {
        return useShowReceipt();
    },
});
</script>
