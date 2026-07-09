<script setup>
import { computed } from 'vue';

const props = defineProps({
    createdBy: {
        type: [String, Object],
        default: null,
    },
    approvedBy: {
        type: [String, Object],
        default: null,
    },
    approvedAt: {
        type: String,
        default: null,
    },
    createdAt: {
        type: String,
        default: null,
    },
});

const resolveName = (value) => {
    if (!value) {
        return '—';
    }

    if (typeof value === 'string') {
        return value;
    }

    return value.name || value.email || '—';
};

const entries = computed(() => [
    {
        label: 'Created by',
        value: resolveName(props.createdBy),
        icon: 'pi pi-user-plus',
    },
    {
        label: 'Created at',
        value: props.createdAt || '—',
        icon: 'pi pi-calendar-plus',
    },
    {
        label: 'Approved by',
        value: resolveName(props.approvedBy),
        icon: 'pi pi-check-circle',
    },
    {
        label: 'Approved at',
        value: props.approvedAt || '—',
        icon: 'pi pi-clock',
    },
]);
</script>

<template>
    <section
        class="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4"
        aria-label="Audit trail"
    >
        <h3 class="m-0 mb-3 text-sm font-semibold uppercase tracking-wide text-rosewood">
            Audit Trail
        </h3>

        <dl class="m-0 grid gap-3 sm:grid-cols-2">
            <div
                v-for="entry in entries"
                :key="entry.label"
                class="flex items-start gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-solid)] p-3"
            >
                <i
                    :class="entry.icon"
                    class="mt-0.5 text-rosewood"
                    aria-hidden="true"
                />
                <div>
                    <dt class="text-xs uppercase tracking-wide text-[var(--admin-text-muted)]">
                        {{ entry.label }}
                    </dt>
                    <dd class="m-0 mt-1 text-sm font-medium text-[var(--admin-text)]">
                        {{ entry.value }}
                    </dd>
                </div>
            </div>
        </dl>
    </section>
</template>
