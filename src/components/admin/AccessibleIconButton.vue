<script setup>
defineProps({
    ariaLabel: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: '',
    },
    severity: {
        type: String,
        default: undefined,
    },
    outlined: {
        type: Boolean,
        default: false,
    },
    text: {
        type: Boolean,
        default: true,
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['click']);
</script>

<template>
    <Button
        type="button"
        :icon="icon"
        :severity="severity"
        :outlined="outlined"
        :text="text"
        :rounded="rounded"
        :disabled="disabled"
        :loading="loading"
        :aria-label="ariaLabel"
        v-bind="$attrs"
        @click="$emit('click', $event)"
    />
</template>
