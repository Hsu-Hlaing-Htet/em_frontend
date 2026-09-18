<template>
    <p :class="['developer-credit', `developer-credit--${variant}`]">
        Designed and Developed by
        <a
            href="https://github.com/Hsu-Hlaing-Htet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Hsu_Hlaing_Htet on GitHub"
        >
            Hsu_Hlaing_Htet
        </a>
    </p>
</template>

<script setup>
defineProps({
    variant: {
        type: String,
        default: 'portal',
        validator: (value) => ['portal', 'dark'].includes(value),
    },
});
</script>

<style scoped>
.developer-credit {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.45;
    color: inherit;
}

.developer-credit a {
    color: #a9adb5;
    text-decoration: none;
    transition: color 0.25s ease, text-decoration-color 0.25s ease;
    text-underline-offset: 0.18em;
}

.developer-credit a:hover,
.developer-credit a:focus-visible {
    text-decoration: underline;
    outline: none;
}

.developer-credit--dark {
    color: #777b82;
}

.developer-credit--dark a:hover,
.developer-credit--dark a:focus-visible {
    color: #f5f2ee;
}

.developer-credit--portal {
    color: var(--admin-text-muted, #777b82);
}

.developer-credit--portal a {
    color: #a9adb5;
}

.developer-credit--portal a:hover,
.developer-credit--portal a:focus-visible {
    color: var(--rw-primary, #8f2338);
}
</style>
