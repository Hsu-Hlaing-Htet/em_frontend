<script setup>
import { computed, useId } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    error: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
    htmlFor: {
        type: String,
        default: '',
    },
});

const fieldId = useId();
const errorId = useId();

const controlId = computed(() => props.htmlFor || fieldId);
const describedBy = computed(() => (props.error ? errorId : undefined));
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <label
            :for="controlId"
            class="text-sm font-semibold text-[var(--admin-text)]"
        >
            {{ label }}
            <span
                v-if="required"
                class="text-rosewood"
                aria-hidden="true"
            >*</span>
            <span
                v-if="required"
                class="sr-only"
            >(required)</span>
        </label>

        <slot
            :id="controlId"
            :aria-invalid="error ? 'true' : undefined"
            :aria-describedby="describedBy"
        />

        <small
            v-if="error"
            :id="errorId"
            class="text-sm text-red-600"
            role="alert"
        >
            {{ error }}
        </small>
    </div>
</template>

<style scoped>
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
