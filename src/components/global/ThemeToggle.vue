<template>
    <button
        type="button"
        class="theme-toggle"
        :class="{ 'theme-toggle--plain': plain }"
        :aria-label="$t(isDark ? 'common.switchToLightTheme' : 'common.switchToDarkTheme')"
        @click="toggle"
    >
        <i class="pi" :class="isDark ? 'pi-sun' : 'pi-moon'" />
    </button>
</template>

<script setup>
import { useTheme } from '@/composables/global/useTheme';

defineProps({
    plain: {
        type: Boolean,
        default: false,
    },
});

const { isDark, toggle } = useTheme();
</script>
