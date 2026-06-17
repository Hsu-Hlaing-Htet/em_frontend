<template>
    <button
        type="button"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="themeStore.toggle()"
    >
        <i class="pi" :class="isDark ? 'pi-sun' : 'pi-moon'" />
    </button>
</template>

<script setup>
import { computed } from 'vue';
import { useThemeStore } from '@/modules/admin/themeStore';

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
</script>

