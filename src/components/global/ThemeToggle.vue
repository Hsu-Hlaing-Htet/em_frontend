<template>
    <button
        type="button"
        class="theme-toggle"
        :aria-label="$t(isDark ? 'common.switchToLightTheme' : 'common.switchToDarkTheme')"
        @click="toggle"
    >
        <i class="pi" :class="isDark ? 'pi-sun' : 'pi-moon'" />
    </button>
</template>

<script setup>
import { useTheme } from '@/composables/global/useTheme';

const { isDark, toggle } = useTheme();
</script>
