import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
    DEFAULT_LOCALE,
    LOCALE_STORAGE_KEY,
    SUPPORTED_LOCALES,
    i18n,
    resolveInitialLocale,
} from '@/i18n';

export const useLocaleStore = defineStore('locale', () => {
    const locale = ref(resolveInitialLocale());

    const codeLabel = computed(() => (locale.value === 'my' ? 'MY' : 'EN'));

    function applyLocale(nextLocale) {
        const normalizedLocale = SUPPORTED_LOCALES.includes(nextLocale)
            ? nextLocale
            : DEFAULT_LOCALE;

        locale.value = normalizedLocale;

        if (i18n.global.locale && typeof i18n.global.locale === 'object' && 'value' in i18n.global.locale) {
            i18n.global.locale.value = normalizedLocale;
        } else {
            i18n.global.locale = normalizedLocale;
        }

        document.documentElement.setAttribute('lang', normalizedLocale);
    }

    function setLocale(nextLocale) {
        if (!SUPPORTED_LOCALES.includes(nextLocale)) {
            return;
        }

        localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
        applyLocale(nextLocale);
    }

    function init() {
        const initialLocale = resolveInitialLocale();
        localStorage.setItem(LOCALE_STORAGE_KEY, initialLocale);
        applyLocale(initialLocale);
    }

    return {
        locale,
        codeLabel,
        setLocale,
        init,
    };
});
