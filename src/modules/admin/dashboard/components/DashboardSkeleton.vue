<script setup>
defineProps({
    rows: {
        type: Number,
        default: 4,
    },
    columns: {
        type: Number,
        default: 4,
    },
});
</script>

<template>
    <div class="dashboard-skeleton">
        <div
            v-for="row in rows"
            :key="row"
            class="dashboard-skeleton-row"
            :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
        >
            <div
                v-for="column in columns"
                :key="column"
                class="dashboard-skeleton-cell"
            />
        </div>
    </div>
</template>

<style scoped>
.dashboard-skeleton {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.dashboard-skeleton-row {
    display: grid;
    gap: 0.75rem;
}

.dashboard-skeleton-cell {
    height: 2.75rem;
    border-radius: 0.75rem;
    background: linear-gradient(
        90deg,
        rgba(214, 184, 193, 0.12) 25%,
        rgba(214, 184, 193, 0.24) 50%,
        rgba(214, 184, 193, 0.12) 75%
    );
    background-size: 200% 100%;
    animation: dashboard-skeleton-shimmer 1.4s ease infinite;
}

@keyframes dashboard-skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}
</style>
