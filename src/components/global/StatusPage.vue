<script setup>
defineProps({
    code: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    primaryCta: {
        type: Object,
        required: true,
    },
});

defineEmits(['back']);
</script>

<template>
    <div class="rw-status-page">
        <div class="rw-status-card">
            <p class="rw-status-code" aria-hidden="true">
                {{ code }}
            </p>

            <div class="rw-status-icon" aria-hidden="true">
                <i :class="icon" />
            </div>

            <h1 class="rw-status-title">{{ title }}</h1>
            <p class="rw-status-message">{{ message }}</p>

            <div class="rw-status-actions">
                <button
                    type="button"
                    class="rw-status-button rw-status-button--secondary"
                    @click="$emit('back')"
                >
                    <i class="pi pi-arrow-left" aria-hidden="true" />
                    Go back
                </button>

                <router-link
                    :to="primaryCta.to"
                    class="rw-status-button rw-status-button--primary"
                >
                    {{ primaryCta.label }}
                </router-link>
            </div>
        </div>
    </div>
</template>
