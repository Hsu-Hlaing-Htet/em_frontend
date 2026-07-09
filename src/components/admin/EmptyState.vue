<script setup>
defineProps({
    icon: {
        type: String,
        default: 'pi pi-inbox',
    },
    message: {
        type: String,
        default: 'No records found.',
    },
    title: {
        type: String,
        default: 'Nothing here yet',
    },
});
</script>

<template>
    <div
        class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] px-6 py-12 text-center"
        role="status"
    >
        <div
            class="grid h-14 w-14 place-items-center rounded-full bg-rosewood/10 text-rosewood"
            aria-hidden="true"
        >
            <i :class="icon" class="text-2xl" />
        </div>

        <div>
            <h3 class="m-0 text-base font-semibold text-[var(--admin-text)]">
                {{ title }}
            </h3>
            <p class="m-0 mt-1 text-sm text-[var(--admin-text-muted)]">
                {{ message }}
            </p>
        </div>

        <div
            v-if="$slots.default"
            class="mt-1"
        >
            <slot />
        </div>
    </div>
</template>
