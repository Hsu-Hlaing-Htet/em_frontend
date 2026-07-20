<script setup>
import Dialog from 'primevue/dialog';
import StatusBadge from '@/components/global/StatusBadge.vue';

defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: 'Details',
    },
    item: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['close']);
</script>

<template>
    <Dialog
        :visible="visible"
        modal
        :header="title"
        class="dashboard-detail-dialog"
        :style="{ width: 'min(100%, 34rem)' }"
        @update:visible="(visible) => { if (!visible) emit('close'); }"
    >
        <div
            v-if="item"
            class="flex flex-col gap-3"
        >
            <div
                v-for="(value, key) in item"
                :key="key"
                class="dashboard-detail-row"
            >
                <span class="dashboard-detail-label">{{ key }}</span>

                <StatusBadge
                    v-if="key === 'status'"
                    :value="value"
                />

                <strong
                    v-else
                    class="dashboard-detail-value"
                >
                    {{ value }}
                </strong>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.dashboard-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid var(--admin-border);
    padding-bottom: 0.65rem;
}

.dashboard-detail-label {
    font-size: 0.8125rem;
    text-transform: capitalize;
    color: var(--admin-text-muted);
}

.dashboard-detail-value {
    font-size: 0.875rem;
    color: var(--admin-text);
    text-align: right;
}
</style>
