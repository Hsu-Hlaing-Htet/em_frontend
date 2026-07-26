<template>
    <article class="admin-panel">
        <span v-if="icon" class="customer-stat-icon">
            <i :class="icon" />
        </span>
        <p class="m-0 mb-1 text-sm text-[var(--admin-text-muted)]">{{ label }}</p>
        <p class="m-0 text-2xl font-semibold">{{ value }}</p>
    </article>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CustomerStatCard',
    props: {
        label: { type: String, required: true },
        value: { type: [String, Number], required: true },
        icon: { type: String, default: '' },
    },
});
</script>
