<script setup>
import RwEmptyState from '@/components/global/RwEmptyState.vue';

defineProps({
    icon: {
        type: String,
        default: 'pi pi-inbox',
    },
    title: {
        type: String,
        default: 'No records found',
    },
    message: {
        type: String,
        default: 'Try adjusting your search or filters, or create a new record.',
    },
    primaryCta: {
        type: Object,
        default: null,
    },
    secondaryCta: {
        type: Object,
        default: null,
    },
});

defineEmits(['primary', 'secondary']);
</script>

<template>
    <RwEmptyState
        compact
        :icon="icon"
        :title="title"
        :message="message"
        :primary-cta="primaryCta"
        :secondary-cta="secondaryCta"
        @primary="$emit('primary', $event)"
        @secondary="$emit('secondary', $event)"
    >
        <template
            v-if="$slots.default"
            #actions
        >
            <slot />
        </template>
    </RwEmptyState>
</template>
