<template>
    <button
        type="button"
        class="theme-toggle"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggle"
    >
        <i class="pi" :class="isDark ? 'pi-sun' : 'pi-moon'" />
    </button>
</template>

<script setup>
import { useTheme } from '@/composables/global/useTheme';

const { isDark, toggle } = useTheme();
</script>
