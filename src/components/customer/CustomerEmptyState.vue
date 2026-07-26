<template>
    <div class="admin-panel text-center">
        <i :class="icon" class="mb-3 block text-2xl text-[var(--admin-primary)]" />
        <h3 class="m-0 mb-2 text-base font-semibold">{{ title }}</h3>
        <p class="m-0 text-sm text-[var(--admin-text-muted)]">{{ message }}</p>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CustomerEmptyState',
    props: {
        icon: { type: String, default: 'pi pi-inbox' },
        title: { type: String, default: 'Nothing here yet' },
        message: { type: String, default: 'There are no records to show.' },
    },
});
</script>
