<script setup>
import { computed } from 'vue';
import DeveloperCredit from '@/components/global/DeveloperCredit.vue';

const props = defineProps({
    /**
     * footer — standalone element (Customer / Admin / Auth)
     * div    — embed inside Public marketing footer
     */
    tag: {
        type: String,
        default: 'footer',
        validator: (value) => ['footer', 'div'].includes(value),
    },
    /**
     * portal — light/dark themed admin & customer shells
     * on-dark — public marketing footer bottom bar
     */
    variant: {
        type: String,
        default: 'portal',
        validator: (value) => ['portal', 'on-dark'].includes(value),
    },
    year: {
        type: Number,
        default: () => new Date().getFullYear(),
    },
});

const rootClass = computed(() => [
    'rosewood-footer',
    `rosewood-footer--${props.variant}`,
]);
</script>

<template>
    <component
        :is="tag"
        :class="rootClass"
        data-rosewood-footer
    >
        <div class="rosewood-footer__inner">
            <p class="rosewood-footer__legal">
                © {{ year }} Rosewood Royale. All rights reserved.
            </p>
            <DeveloperCredit />
        </div>
    </component>
</template>
