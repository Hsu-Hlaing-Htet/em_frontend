<script setup>
import { computed } from 'vue';
import logoDark from '@/assets/images/logo-dark.jpg';
import logoWhite from '@/assets/images/logo-white.jpg';

const props = defineProps({
    to: {
        type: [String, Object],
        default: null,
    },
    /**
     * on-dark  — public header / dark chrome (logo-white + ivory text)
     * on-light — admin, customer, auth (logo-dark + burgundy text)
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

const logoSrc = computed(() => (props.variant === 'on-dark' ? logoWhite : logoDark));

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
            :src="logoSrc"
            alt=""
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
            :src="logoSrc"
            alt=""
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
