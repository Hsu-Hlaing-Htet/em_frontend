import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import my from '@/locales/my.json';

export const LOCALE_STORAGE_KEY = 'rosewood_locale';
export const SUPPORTED_LOCALES = ['en', 'my'];
export const DEFAULT_LOCALE = 'en';

export function resolveInitialLocale() {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);

    if (SUPPORTED_LOCALES.includes(saved)) {
        return saved;
    }

    return DEFAULT_LOCALE;
}

export const i18n = createI18n({
    legacy: false,
    locale: resolveInitialLocale(),
    fallbackLocale: DEFAULT_LOCALE,
    messages: {
        en,
        my,
    },
});

export default i18n;
