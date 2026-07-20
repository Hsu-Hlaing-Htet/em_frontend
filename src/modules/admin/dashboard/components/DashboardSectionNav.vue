<script setup>
import { DASHBOARD_SECTION_GROUPS, DASHBOARD_SECTIONS } from '../config/sections';

defineProps({
    activeSection: {
        type: String,
        required: true,
    },
    unreadNotificationCount: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['select']);
</script>

<template>
    <nav class="dashboard-section-nav dashboard-glass">
        <div
            v-for="group in DASHBOARD_SECTION_GROUPS"
            :key="group.key"
            class="dashboard-section-group"
        >
            <p class="dashboard-section-group-label">
                {{ group.label }}
            </p>

            <div class="dashboard-section-group-items">
                <button
                    v-for="sectionKey in group.sections"
                    :key="sectionKey"
                    type="button"
                    class="dashboard-section-button"
                    :class="{ 'dashboard-section-button-active': activeSection === sectionKey }"
                    @click="emit('select', sectionKey)"
                >
                    <i :class="DASHBOARD_SECTIONS[sectionKey].icon" />
                    <span>{{ DASHBOARD_SECTIONS[sectionKey].label }}</span>
                    <span
                        v-if="sectionKey === 'notifications' && unreadNotificationCount"
                        class="dashboard-section-badge"
                    >
                        {{ unreadNotificationCount }}
                    </span>
                </button>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.dashboard-section-nav {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1rem;
    border-radius: 1rem;
    border: 1px solid color-mix(in srgb, var(--admin-border) 78%, transparent);
    padding: 1rem;
}

@media (min-width: 1024px) {
    .dashboard-section-nav {
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }
}

.dashboard-section-group-label {
    margin: 0 0 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--admin-text-muted);
}

.dashboard-section-group-items {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.dashboard-section-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid transparent;
    background: transparent;
    padding: 0.55rem 0.65rem;
    font-size: 0.8125rem;
    color: var(--admin-text-muted);
    text-align: left;
    transition: all 0.2s ease;
}

.dashboard-section-button:hover,
.dashboard-section-button-active {
    border-color: rgba(122, 49, 73, 0.25);
    background: rgba(214, 184, 193, 0.12);
    color: var(--admin-text);
}

.dashboard-section-badge {
    margin-left: auto;
    display: inline-flex;
    min-width: 1.1rem;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background: var(--admin-primary);
    padding: 0.1rem 0.35rem;
    font-size: 0.625rem;
    color: var(--admin-bg);
}
</style>
