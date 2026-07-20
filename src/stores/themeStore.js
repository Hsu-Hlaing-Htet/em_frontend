import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const THEME_STORAGE_KEY = 'rosewood-theme';
export const THEME_MODES = ['light', 'dark'];

function applyThemeToDocument(mode) {
    document.documentElement.setAttribute('data-theme', mode);
}

export const useThemeStore = defineStore('theme', () => {
    const mode = ref(localStorage.getItem(THEME_STORAGE_KEY) || 'light');

    const isDark = computed(() => mode.value === 'dark');

    function applyTheme() {
        applyThemeToDocument(mode.value);
    }

    function setMode(nextMode) {
        if (!THEME_MODES.includes(nextMode)) {
            return;
        }

        mode.value = nextMode;
        localStorage.setItem(THEME_STORAGE_KEY, nextMode);
        applyTheme();
    }

    function toggle() {
        setMode(isDark.value ? 'light' : 'dark');
    }

    return {
        mode,
        isDark,
        setMode,
        toggle,
        applyTheme,
    };
});
