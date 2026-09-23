<script setup>
import { computed } from 'vue';

/** Public URL — same asset for all portals (frontend/public/images/logo-dark.jpg). */
const LOGO_SRC = '/images/logo-dark.jpg';

const props = defineProps({
    to: {
        type: [String, Object],
        default: null,
    },
    /**
     * on-dark  — public header / dark chrome
     * on-light — admin, customer, auth
     * Logo asset is always logo-dark.jpg (circular dark badge).
     */
    variant: {
        type: String,
        default: 'on-light',
        validator: (value) => ['on-dark', 'on-light'].includes(value),
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg', 'compact'].includes(value),
    },
    stacked: {
        type: Boolean,
        default: false,
    },
    showName: {
        type: Boolean,
        default: true,
    },
    ariaLabel: {
        type: String,
        default: 'Rosewood Royale',
    },
});

const emit = defineEmits(['click']);

const rootClass = computed(() => [
    'rosewood-brand',
    `rosewood-brand--${props.variant}`,
    `rosewood-brand--${props.size}`,
    {
        'rosewood-brand--stacked': props.stacked,
        'rosewood-brand--name-hidden': !props.showName,
    },
]);

const isLink = computed(() => props.to != null && props.to !== '');

function onClick(event) {
    emit('click', event);
}
</script>

<template>
    <router-link
        v-if="isLink"
        :to="to"
        :class="rootClass"
        :aria-label="ariaLabel"
        @click="onClick"
    >
        <img
            :src="LOGO_SRC"
            alt="Rosewood Royale"
            class="rosewood-brand__logo"
            width="48"
            height="48"
            decoding="async"
        >
        <span
            v-if="showName"
            class="rosewood-brand__name"
        >Rosewood Royale</span>
    </router-link>

    <span
        v-else
        :class="rootClass"
        role="img"
        :aria-label="ariaLabel"
        @click="onClick"
    >
        <img
            :src="LOGO_SRC"
            alt="Rosewood Royale"
            class="rosewood-brand__logo"
            width="48"
            height="48"
            decoding="async"
        >
        <span
            v-if="showName"
            class="rosewood-brand__name"
        >Rosewood Royale</span>
    </span>
</template>
