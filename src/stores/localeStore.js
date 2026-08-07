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
        i18n.global.locale.value = nextLocale;
        document.documentElement.setAttribute('lang', nextLocale === 'my' ? 'my' : 'en');
    }

    function setLocale(nextLocale) {
        if (!SUPPORTED_LOCALES.includes(nextLocale)) {
            return;
        }

        locale.value = nextLocale;
        localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
        applyLocale(nextLocale);
    }

    function init() {
        applyLocale(locale.value || DEFAULT_LOCALE);
    }

    return {
        locale,
        codeLabel,
        setLocale,
        init,
    };
});
