<script setup>
defineProps({
    title: {
        type: String,
        default: 'No records found',
    },
    message: {
        type: String,
        default: 'Try adjusting your search or filter criteria.',
    },
    icon: {
        type: String,
        default: 'pi pi-inbox',
    },
});
</script>

<template>
    <div class="dashboard-empty">
        <div class="dashboard-empty-icon">
            <i :class="icon" />
        </div>
        <h3 class="dashboard-empty-title">
            {{ title }}
        </h3>
        <p class="dashboard-empty-message">
            {{ message }}
        </p>
    </div>
</template>

<style scoped>
.dashboard-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2.5rem 1rem;
    text-align: center;
}

.dashboard-empty-icon {
    display: grid;
    width: 3.5rem;
    height: 3.5rem;
    place-items: center;
    border-radius: 9999px;
    background: rgba(214, 184, 193, 0.14);
    color: var(--admin-primary);
    font-size: 1.25rem;
}

.dashboard-empty-title {
    margin: 0;
    font-size: 1rem;
    color: var(--admin-text);
}

.dashboard-empty-message {
    margin: 0;
    max-width: 24rem;
    font-size: 0.875rem;
    color: var(--admin-text-muted);
}
</style>
