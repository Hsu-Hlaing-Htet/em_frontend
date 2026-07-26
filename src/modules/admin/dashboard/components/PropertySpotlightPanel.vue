<script setup>
import StatusBadge from '@/components/global/StatusBadge.vue';

defineProps({
    title: {
        type: String,
        required: true,
    },
    properties: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    formatCurrency: {
        type: Function,
        required: true,
    },
    isFavorite: {
        type: Function,
        required: true,
    },
    isInCompare: {
        type: Function,
        required: true,
    },
    canAddToCompare: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['view', 'favorite', 'compare']);
</script>

<template>
    <article class="dashboard-panel dashboard-glass">
        <h2 class="m-0 text-base text-rosewood">
            {{ title }}
        </h2>

        <div
            v-if="loading"
            class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
        >
            <div
                v-for="row in 3"
                :key="row"
                class="dashboard-property-skeleton"
            />
        </div>

        <slot
            v-else-if="properties.length"
            name="default"
        >
            <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <article
                    v-for="property in properties"
                    :key="property.id"
                    class="dashboard-property-card dashboard-glass-soft"
                >
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <h3 class="m-0 text-sm font-semibold text-[var(--admin-text)]">
                                {{ property.name }}
                            </h3>
                            <p class="m-0 mt-1 text-xs text-[var(--admin-text-muted)]">
                                {{ property.building }}
                            </p>
                        </div>
                        <StatusBadge :value="property.status" />
                    </div>

                    <p class="m-0 mt-3 text-lg font-semibold text-rosewood">
                        {{ formatCurrency(property.price) }}
                    </p>

                    <div class="mt-3 flex flex-wrap gap-2">
                        <button
                            type="button"
                            class="dashboard-control"
                            :class="{ 'dashboard-control-active': isFavorite(property.id) }"
                            @click="emit('favorite', property)"
                        >
                            <i :class="isFavorite(property.id) ? 'pi pi-heart-fill' : 'pi pi-heart'" />
                            Favorite
                        </button>

                        <button
                            type="button"
                            class="dashboard-control"
                            :class="{ 'dashboard-control-active': isInCompare(property.id) }"
                            :disabled="!isInCompare(property.id) && !canAddToCompare"
                            @click="emit('compare', property)"
                        >
                            <i class="pi pi-clone" />
                            Compare
                        </button>

                        <button
                            type="button"
                            class="dashboard-control dashboard-control-primary"
                            @click="emit('view', property)"
                        >
                            View
                        </button>
                    </div>
                </article>
            </div>
        </slot>

        <div
            v-else
            class="dashboard-property-empty"
        >
            <i class="pi pi-building" />
            <p>No properties to show yet.</p>
        </div>
    </article>
</template>

<style scoped>
.dashboard-property-card {
    border-radius: 1rem;
    padding: 1rem;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dashboard-property-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--admin-shadow-soft);
}

.dashboard-property-skeleton {
    height: 9rem;
    border-radius: 1rem;
    background: linear-gradient(
        90deg,
        var(--rw-hover-bg) 25%,
        var(--highlight-bg) 50%,
        var(--rw-hover-bg) 75%
    );
    background-size: 200% 100%;
    animation: dashboard-property-shimmer 1.4s ease infinite;
}

.dashboard-property-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 2rem 1rem;
    color: var(--admin-text-muted);
}

@keyframes dashboard-property-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
