<script setup>
import { computed } from 'vue';
import { resolveStatusDefinition } from '@/config/statusColors';

const props = defineProps({
    /** Primary prop — backend status value */
    value: {
        type: String,
        default: '',
    },
    /** Alias for legacy StatusTag usage */
    status: {
        type: String,
        default: '',
    },
    showIcon: {
        type: Boolean,
        default: true,
    },
});

const statusValue = computed(() => props.value || props.status);

const config = computed(() => resolveStatusDefinition(statusValue.value));

const toneClass = computed(() => `status-badge--${config.value.tone}`);

const toneStyle = computed(() => ({
    color: `var(--status-${config.value.tone}-text)`,
}));
</script>

<template>
    <span
        class="status-badge"
        :class="toneClass"
        :style="toneStyle"
    >
        <i
            v-if="showIcon && config.icon"
            :class="config.icon"
            class="status-badge__icon"
            aria-hidden="true"
        />
        <span class="status-badge__label">{{ config.label }}</span>
    </span>
</template>
