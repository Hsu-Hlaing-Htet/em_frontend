import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/themeStore';

export function useTheme() {
    const store = useThemeStore();
    const { mode, isDark } = storeToRefs(store);

    return {
        mode,
        isDark,
        setMode: store.setMode,
        toggle: store.toggle,
        applyTheme: store.applyTheme,
    };
}
