<script setup>
import { computed } from 'vue';
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

const propertiesActive = computed(() =>
    ['/properties', '/rent', '/buy'].some((path) =>
        props.currentRoute.path === path || props.currentRoute.path.startsWith('/properties/')
    )
);

function isActive(link) {
    if (link?.to === '/properties') {
        return propertiesActive.value;
    }

    if (typeof link?.to === 'string') {
        return props.currentRoute.path === link.to;
    }

    return props.currentRoute.path === (link?.to?.path || '/');
}
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
                <router-link
                    v-for="link in navLinks"
                    :key="link.label"
                    :to="link.to"
                    class="rw-nav__link"
                    :class="{ 'is-active': isActive(link) }"
                >
                    {{ link.label }}
                </router-link>
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
                        <router-link
                            v-for="link in navLinks"
                            :key="`m-${link.label}`"
                            :to="link.to"
                            class="rw-drawer__link"
                            @click="emit('close-mobile-menu')"
                        >
                            {{ link.label }}
                        </router-link>
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

/* Brand name only — soft white → burgundy (logo untouched) */
.rw-header :deep(.rosewood-brand__name),
.rw-drawer__head :deep(.rosewood-brand__name) {
    color: #f5f5f7;
    transition:
        color 200ms ease-out,
        transform 200ms ease-out,
        letter-spacing 200ms ease-out;
}

.rw-header :deep(.rosewood-brand:hover .rosewood-brand__name),
.rw-header :deep(.rosewood-brand:focus-visible .rosewood-brand__name),
.rw-drawer__head :deep(.rosewood-brand:hover .rosewood-brand__name),
.rw-drawer__head :deep(.rosewood-brand:focus-visible .rosewood-brand__name) {
    color: var(--rw-brand, #8f2338);
    transform: translateX(2px);
    letter-spacing: 0.04em;
}

@media (prefers-reduced-motion: reduce) {
    .rw-header :deep(.rosewood-brand__name),
    .rw-drawer__head :deep(.rosewood-brand__name) {
        transition: color 200ms ease-out;
    }

    .rw-header :deep(.rosewood-brand:hover .rosewood-brand__name),
    .rw-header :deep(.rosewood-brand:focus-visible .rosewood-brand__name),
    .rw-drawer__head :deep(.rosewood-brand:hover .rosewood-brand__name),
    .rw-drawer__head :deep(.rosewood-brand:focus-visible .rosewood-brand__name) {
        transform: none;
        letter-spacing: var(--rosewood-brand-name-tracking, 0.02em);
    }
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

.rw-drawer__link {
    display: block;
    padding: 0.7rem 0.15rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: #f5f2ee;
    font-size: 0.95rem;
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
    .rw-drawer-enter-active,
    .rw-drawer-leave-active {
        transition: none;
    }
}
</style>
