<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue';
import { useStickyNavbar } from '@/composables/public/useStickyNavbar';
import RosewoodBrand from '@/components/global/RosewoodBrand.vue';

const props = defineProps({
    currentRoute: {
        type: Object,
        required: true,
    },
    mobileMenuOpen: {
        type: Boolean,
        required: true,
    },
    navLinks: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['close-mobile-menu', 'open-mobile-menu']);

const { isScrolled } = useStickyNavbar();
const propertiesOpen = ref(false);
const dropdownRoot = ref(null);
const menuFocusIndex = ref(-1);

const propertiesActive = computed(() =>
    ['/properties', '/rent', '/buy'].some((path) =>
        props.currentRoute.path === path || props.currentRoute.path.startsWith('/properties/')
    )
);

const propertiesLink = computed(() =>
    props.navLinks.find((link) => Array.isArray(link.children) && link.children.length)
);

function isActive(link) {
    if (link?.children) {
        return propertiesActive.value;
    }

    if (typeof link?.to === 'string') {
        return props.currentRoute.path === link.to;
    }

    return props.currentRoute.path === (link?.to?.path || '/');
}

function setDropdownRoot(el) {
    dropdownRoot.value = el;
}

function toggleProperties(event) {
    event.stopPropagation();
    propertiesOpen.value = !propertiesOpen.value;
    if (propertiesOpen.value) {
        menuFocusIndex.value = 0;
        nextTick(focusMenuItem);
    }
}

function closeProperties() {
    propertiesOpen.value = false;
    menuFocusIndex.value = -1;
}

function focusMenuItem() {
    const items = dropdownRoot.value?.querySelectorAll('.rw-nav__menu-link');
    if (!items?.length || menuFocusIndex.value < 0) {
        return;
    }
    items[menuFocusIndex.value]?.focus();
}

function onTriggerKeydown(event) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        propertiesOpen.value = true;
        menuFocusIndex.value = 0;
        nextTick(focusMenuItem);
    }

    if (event.key === 'Escape') {
        closeProperties();
    }
}

function onMenuKeydown(event) {
    const children = propertiesLink.value?.children || [];
    if (!children.length) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        closeProperties();
        dropdownRoot.value?.querySelector('.rw-nav__trigger')?.focus();
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        menuFocusIndex.value = (menuFocusIndex.value + 1) % children.length;
        focusMenuItem();
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        menuFocusIndex.value = (menuFocusIndex.value - 1 + children.length) % children.length;
        focusMenuItem();
    }

    if (event.key === 'Home') {
        event.preventDefault();
        menuFocusIndex.value = 0;
        focusMenuItem();
    }

    if (event.key === 'End') {
        event.preventDefault();
        menuFocusIndex.value = children.length - 1;
        focusMenuItem();
    }
}

function onDocumentClick(event) {
    if (!dropdownRoot.value?.contains(event.target)) {
        closeProperties();
    }
}

function onDocumentKeydown(event) {
    if (event.key === 'Escape') {
        closeProperties();
    }
}

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentKeydown);
});
</script>

<template>
    <header
        class="rw-header"
        :class="{ 'is-scrolled': isScrolled }"
    >
        <div class="container rw-header__inner">
            <RosewoodBrand
                to="/"
                variant="on-dark"
                size="md"
                class="rw-header__brand"
                @click="emit('close-mobile-menu')"
            />

            <nav class="rw-nav" aria-label="Primary">
                <template v-for="link in navLinks" :key="link.label">
                    <div
                        v-if="link.children"
                        :ref="setDropdownRoot"
                        class="rw-nav__dropdown"
                    >
                        <button
                            type="button"
                            class="rw-nav__link rw-nav__trigger"
                            :class="{ 'is-active': isActive(link) || propertiesOpen }"
                            :aria-expanded="propertiesOpen"
                            aria-haspopup="menu"
                            aria-label="Properties menu"
                            @click="toggleProperties"
                            @keydown="onTriggerKeydown"
                        >
                            {{ link.label }}
                            <i
                                class="fas fa-chevron-down"
                                :class="{ 'is-open': propertiesOpen }"
                            />
                        </button>

                        <Transition name="rw-drop">
                            <div
                                v-if="propertiesOpen"
                                class="rw-nav__menu"
                                role="menu"
                                @click.stop
                                @keydown="onMenuKeydown"
                            >
                                <router-link
                                    v-for="(child, index) in link.children"
                                    :key="child.label"
                                    :to="child.to"
                                    class="rw-nav__menu-link"
                                    role="menuitem"
                                    tabindex="-1"
                                    @focus="menuFocusIndex = index"
                                    @click="closeProperties"
                                >
                                    {{ child.label }}
                                </router-link>
                            </div>
                        </Transition>
                    </div>

                    <router-link
                        v-else
                        :to="link.to"
                        class="rw-nav__link"
                        :class="{ 'is-active': isActive(link) }"
                    >
                        {{ link.label }}
                    </router-link>
                </template>
            </nav>

            <div class="rw-header__actions">
                <button
                    type="button"
                    class="rw-header__menu-btn"
                    aria-label="Open menu"
                    @click="emit('open-mobile-menu')"
                >
                    <i class="fas fa-bars" />
                </button>
            </div>
        </div>
    </header>

    <Teleport to="body">
        <Transition name="rw-drawer">
            <div
                v-if="mobileMenuOpen"
                class="rw-drawer"
            >
                <div
                    class="rw-drawer__backdrop"
                    @click="emit('close-mobile-menu')"
                />
                <aside class="rw-drawer__panel">
                    <div class="rw-drawer__head">
                        <RosewoodBrand
                            to="/"
                            variant="on-dark"
                            size="sm"
                            @click="emit('close-mobile-menu')"
                        />
                        <button
                            type="button"
                            class="rw-header__menu-btn"
                            aria-label="Close menu"
                            @click="emit('close-mobile-menu')"
                        >
                            <i class="fas fa-xmark" />
                        </button>
                    </div>

                    <nav class="rw-drawer__nav">
                        <template v-for="link in navLinks" :key="`m-${link.label}`">
                            <template v-if="link.children">
                                <p class="rw-drawer__label">{{ link.label }}</p>
                                <router-link
                                    v-for="child in link.children"
                                    :key="`m-${child.label}`"
                                    :to="child.to"
                                    class="rw-drawer__link"
                                    @click="emit('close-mobile-menu')"
                                >
                                    {{ child.label }}
                                </router-link>
                            </template>
                            <router-link
                                v-else
                                :to="link.to"
                                class="rw-drawer__link"
                                @click="emit('close-mobile-menu')"
                            >
                                {{ link.label }}
                            </router-link>
                        </template>
                    </nav>
                </aside>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.rw-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    overflow: visible;
    border-bottom: 1px solid transparent;
    background: rgba(13, 13, 15, 0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: background 0.35s ease, border-color 0.35s ease;
}

.rw-header.is-scrolled {
    background: rgba(13, 13, 15, 0.92);
    border-bottom-color: rgba(255, 255, 255, 0.1);
}

.rw-header__inner {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    min-height: 64px;
    gap: 1rem;
    overflow: visible;
}

.rw-header__brand {
    justify-self: start;
}

.rw-nav {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 0.15rem;
    overflow: visible;
}

.rw-nav__link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.75rem;
    border: 0;
    background: transparent;
    color: #a9adb5;
    font-family: var(--rw-font-sans, Inter, sans-serif);
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.28s ease;
}

.rw-nav__link::after {
    content: '';
    position: absolute;
    left: 0.75rem;
    right: 0.75rem;
    bottom: 0.15rem;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.28s ease;
}

.rw-nav__link:hover,
.rw-nav__link:focus-visible {
    color: #f5f2ee;
}

.rw-nav__link:hover::after,
.rw-nav__link:focus-visible::after,
.rw-nav__link.is-active::after {
    transform: scaleX(1);
}

.rw-nav__link.is-active {
    color: #8f2338;
}

.rw-nav__trigger i {
    font-size: 0.55rem;
    transition: transform 0.25s ease;
}

.rw-nav__trigger i.is-open {
    transform: rotate(180deg);
}

.rw-nav__dropdown {
    position: relative;
    z-index: 9999;
    overflow: visible;
}

.rw-nav__menu {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    z-index: 9999;
    min-width: 220px;
    padding: 0.4rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(20, 20, 22, 0.96);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    pointer-events: auto;
}

.rw-nav__menu-link {
    position: relative;
    display: block;
    padding: 0.65rem 0.8rem 0.65rem 0.95rem;
    border-radius: 8px;
    color: #a9adb5;
    font-size: 0.82rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    text-transform: none;
    outline: none;
    transition: background 0.25s ease, color 0.25s ease, padding-left 0.25s ease;
}

.rw-nav__menu-link::before {
    content: '';
    position: absolute;
    left: 0.35rem;
    top: 0.55rem;
    bottom: 0.55rem;
    width: 2px;
    border-radius: 999px;
    background: #8f2338;
    opacity: 0;
    transform: scaleY(0.4);
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.rw-nav__menu-link:hover,
.rw-nav__menu-link:focus-visible {
    background: rgba(143, 35, 56, 0.14);
    color: #f5f2ee;
    padding-left: 1.05rem;
}

.rw-nav__menu-link:hover::before,
.rw-nav__menu-link:focus-visible::before {
    opacity: 1;
    transform: scaleY(1);
}

.rw-header__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.rw-header__menu-btn {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
    color: #f5f2ee;
    cursor: pointer;
}

.rw-drawer {
    position: fixed;
    inset: 0;
    z-index: 140;
}

.rw-drawer__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
}

.rw-drawer__panel {
    position: absolute;
    top: 0;
    right: 0;
    width: min(340px, 92vw);
    height: 100%;
    padding: 1.15rem 1.25rem 2rem;
    background: #121315;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    overflow: auto;
}

.rw-drawer__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
}

.rw-drawer__nav {
    display: grid;
    gap: 0.25rem;
}

.rw-drawer__label {
    margin: 0.85rem 0 0.25rem;
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #777b82;
}

.rw-drawer__link {
    display: block;
    padding: 0.7rem 0.15rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: #f5f2ee;
    font-size: 0.95rem;
}

.rw-drop-enter-active,
.rw-drop-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.rw-drop-enter-from,
.rw-drop-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.rw-drawer-enter-active,
.rw-drawer-leave-active {
    transition: opacity 0.28s ease;
}

.rw-drawer-enter-active .rw-drawer__panel,
.rw-drawer-leave-active .rw-drawer__panel {
    transition: transform 0.32s ease;
}

.rw-drawer-enter-from,
.rw-drawer-leave-to {
    opacity: 0;
}

.rw-drawer-enter-from .rw-drawer__panel,
.rw-drawer-leave-to .rw-drawer__panel {
    transform: translateX(20px);
}

@media (min-width: 980px) {
    .rw-header__inner {
        grid-template-columns: 1fr auto 1fr;
    }

    .rw-nav {
        display: flex;
    }

    .rw-header__menu-btn {
        display: none;
    }

    .rw-header__actions {
        min-height: 1px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rw-drop-enter-active,
    .rw-drop-leave-active,
    .rw-drawer-enter-active,
    .rw-drawer-leave-active {
        transition: none;
    }
}
</style>
