<script setup>
import Dialog from 'primevue/dialog';
import StatusBadge from '@/components/global/StatusBadge.vue';

defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    items: {
        type: Array,
        default: () => [],
    },
    formatCurrency: {
        type: Function,
        required: true,
    },
});

const emit = defineEmits(['close', 'remove', 'clear']);
</script>

<template>
    <Dialog
        :visible="visible"
        modal
        header="Compare Properties"
        class="dashboard-compare-dialog"
        :style="{ width: 'min(100%, 56rem)' }"
        @update:visible="(value) => { if (!value) emit('close'); }"
    >
        <div
            v-if="items.length < 2"
            class="dashboard-compare-empty"
        >
            Select at least two properties to compare.
        </div>

        <div
            v-else
            class="dashboard-compare-grid"
        >
            <article
                v-for="item in items"
                :key="item.id"
                class="dashboard-compare-card dashboard-glass"
            >
                <div class="flex items-start justify-between gap-2">
                    <h3 class="m-0 text-base text-rosewood">
                        {{ item.name }}
                    </h3>
                    <button
                        type="button"
                        class="dashboard-icon-button"
                        aria-label="Remove from compare"
                        @click="emit('remove', item.id)"
                    >
                        <i class="pi pi-times" />
                    </button>
                </div>

                <dl class="dashboard-compare-list">
                    <div><dt>Building</dt><dd>{{ item.building }}</dd></div>
                    <div><dt>Type</dt><dd>{{ item.type }}</dd></div>
                    <div><dt>Area</dt><dd>{{ item.area }} sqft</dd></div>
                    <div><dt>Price</dt><dd>{{ formatCurrency(item.price) }}</dd></div>
                    <div><dt>Status</dt><dd><StatusBadge :value="item.status" /></dd></div>
                </dl>
            </article>
        </div>

        <template #footer>
            <button
                type="button"
                class="dashboard-control"
                @click="emit('clear')"
            >
                Clear compare
            </button>
        </template>
    </Dialog>
</template>

<style scoped>
.dashboard-compare-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 1rem;
}

.dashboard-compare-card {
    border-radius: 1rem;
    padding: 1rem;
}

.dashboard-compare-list {
    display: grid;
    gap: 0.65rem;
    margin: 1rem 0 0;
}

.dashboard-compare-list div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-bottom: 1px solid var(--admin-border);
    padding-bottom: 0.45rem;
}

.dashboard-compare-list dt {
    margin: 0;
    font-size: 0.75rem;
    color: var(--admin-text-muted);
}

.dashboard-compare-list dd {
    margin: 0;
    font-size: 0.875rem;
    color: var(--admin-text);
}

.dashboard-compare-empty {
    padding: 1rem 0;
    color: var(--admin-text-muted);
}

.dashboard-icon-button {
    display: grid;
    width: 2rem;
    height: 2rem;
    place-items: center;
    border-radius: 9999px;
    border: 1px solid var(--admin-border);
    background: var(--admin-surface-solid);
    color: var(--admin-text);
}
</style>
