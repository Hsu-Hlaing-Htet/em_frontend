import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'rosewood-admin-theme';

function applyThemeToDocument(mode) {
    document.documentElement.setAttribute('data-admin-theme', mode);
}

export const useThemeStore = defineStore('adminTheme', () => {
    const mode = ref(localStorage.getItem(STORAGE_KEY) || 'light');

    const isDark = computed(() => mode.value === 'dark');

    function applyTheme() {
        applyThemeToDocument(mode.value);
    }

    function setMode(nextMode) {
        mode.value = nextMode;
        localStorage.setItem(STORAGE_KEY, nextMode);
        applyTheme();
    }

    function toggle() {
        setMode(isDark.value ? 'light' : 'dark');
    }

    watch(mode, applyTheme, { immediate: true });

    return {
        mode,
        isDark,
        getMode: computed(() => mode.value),
        setMode,
        toggle,
        applyTheme,
    };
});
