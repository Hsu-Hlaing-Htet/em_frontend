<template>
    <div class="language-switcher" ref="rootEl">
        <button
            type="button"
            class="language-switcher-trigger"
            aria-haspopup="listbox"
            :aria-expanded="open"
            aria-label="Change language"
            @click="toggle"
        >
            <span class="language-switcher-globe" aria-hidden="true">🌐</span>
            <span class="language-switcher-code">{{ codeLabel }}</span>
            <i class="pi pi-angle-down language-switcher-caret" aria-hidden="true" />
        </button>

        <ul
            v-if="open"
            class="language-switcher-menu"
            role="listbox"
            :aria-label="$t('common.changeLanguage')"
        >
            <li
                role="option"
                :aria-selected="locale === 'en'"
                :class="{ 'is-active': locale === 'en' }"
                tabindex="0"
                @click="select('en')"
                @keydown.enter.prevent="select('en')"
            >
                {{ $t('common.english') }}
            </li>
            <li
                role="option"
                :aria-selected="locale === 'my'"
                :class="{ 'is-active': locale === 'my' }"
                tabindex="0"
                @click="select('my')"
                @keydown.enter.prevent="select('my')"
            >
                {{ $t('common.myanmar') }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocaleStore } from '@/stores/localeStore';

const localeStore = useLocaleStore();
const { locale, codeLabel } = storeToRefs(localeStore);
const open = ref(false);
const rootEl = ref(null);

function toggle() {
    open.value = !open.value;
}

function select(nextLocale) {
    localeStore.setLocale(nextLocale);
    open.value = false;
}

function onDocumentClick(event) {
    if (!rootEl.value?.contains(event.target)) {
        open.value = false;
    }
}

function onEscape(event) {
    if (event.key === 'Escape') {
        open.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onEscape);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onEscape);
});
</script>

<style scoped>
.language-switcher {
    position: relative;
}

.language-switcher-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    min-width: 2.5rem;
    height: 2.5rem;
    padding: 0 0.65rem;
    border-radius: 6px;
    border: 1px solid var(--rw-border, var(--admin-border));
    background: var(--rw-surface-solid, var(--admin-surface-solid));
    color: var(--rw-text-muted, var(--admin-text-muted));
    cursor: pointer;
    transition:
        background-color 0.3s ease,
        color 0.3s ease,
        border-color 0.3s ease;
}

.language-switcher-trigger:hover,
.language-switcher-trigger:focus-visible {
    color: var(--rw-text, var(--admin-text));
    outline: none;
}

.language-switcher-trigger:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--admin-primary, #8b5a2b) 35%, transparent);
}

.language-switcher-globe {
    font-size: 0.85rem;
    line-height: 1;
}

.language-switcher-code {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}

.language-switcher-caret {
    font-size: 0.7rem;
}

.language-switcher-menu {
    position: absolute;
    top: calc(100% + 0.35rem);
    right: 0;
    z-index: 1100;
    min-width: 8.5rem;
    margin: 0;
    padding: 0.35rem;
    list-style: none;
    border-radius: 8px;
    border: 1px solid var(--rw-border, var(--admin-border));
    background: var(--rw-surface-solid, var(--admin-surface-solid));
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.language-switcher-menu li {
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--rw-text, var(--admin-text));
    cursor: pointer;
}

.language-switcher-menu li:hover,
.language-switcher-menu li:focus-visible,
.language-switcher-menu li.is-active {
    background: var(--admin-border, var(--rw-border));
    outline: none;
}
</style>
