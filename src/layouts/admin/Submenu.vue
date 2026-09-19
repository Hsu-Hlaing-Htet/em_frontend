<template>
    <ul v-if="items" class="menu-root" :class="{ 'menu-root--collapsed': isCollapsed }">
        <li
            v-for="(item, i) in items"
            :key="item.key || item.label || i"
            class="menu-item"
            :class="{ 'menu-item--group': item.items }"
            @mouseenter="onItemEnter(i, item)"
            @mouseleave="onItemLeave"
        >
            <!-- Group Menu -->
            <template v-if="item.items">
                <a
                    :ref="(el) => setTriggerRef(i, el)"
                    href="#"
                    class="menu-link"
                    :class="{
                        'menu-link--collapsed': isCollapsed,
                        'menu-link-active': isCollapsed && isGroupRouteActive(item),
                    }"
                    :aria-label="resolveLabel(item)"
                    :aria-expanded="isCollapsed ? isFlyoutOpen(i) : isGroupOpen(item, i)"
                    :aria-haspopup="isCollapsed ? 'menu' : undefined"
                    :aria-controls="isCollapsed ? flyoutId(i) : undefined"
                    :title="isCollapsed ? resolveLabel(item) : undefined"
                    @click.prevent="onGroupClick(i, item)"
                    @keydown="onGroupKeydown($event, i, item)"
                >
                    <i :class="item.icon" class="menu-link-icon" aria-hidden="true" />

                    <span
                        v-if="!isCollapsed"
                        class="menu-link-label"
                    >
                        {{ resolveLabel(item) }}
                    </span>

                    <i
                        v-if="!isCollapsed"
                        class="pi ml-auto"
                        :class="isGroupOpen(item, i) ? 'pi-chevron-down' : 'pi-chevron-right'"
                        aria-hidden="true"
                    />
                </a>

                <!-- Expanded inline children -->
                <transition v-if="!isCollapsed" name="layout-submenu-wrapper">
                    <ul
                        v-show="isGroupOpen(item, i)"
                        class="submenu-container"
                    >
                        <li
                            v-for="child in item.items"
                            :key="child.key || child.label"
                        >
                            <router-link
                                v-slot="{ href, navigate }"
                                :to="child.to"
                                custom
                            >
                                <a
                                    :href="href"
                                    class="menu-link submenu-link"
                                    :class="{ 'menu-link-active': isLeafActive(child) }"
                                    :aria-current="isLeafActive(child) ? 'page' : undefined"
                                    :aria-label="`${resolveLabel(item)}: ${resolveLabel(child)}`"
                                    @click="onMenuNavigate($event, navigate)"
                                >
                                    <i
                                        :class="child.icon"
                                        class="menu-link-icon"
                                        aria-hidden="true"
                                    />
                                    <span class="menu-link-label">{{ resolveLabel(child) }}</span>
                                </a>
                            </router-link>
                        </li>
                    </ul>
                </transition>
            </template>

            <!-- Normal Link -->
            <template v-else>
                <router-link
                    v-slot="{ href, navigate }"
                    :to="item.to"
                    custom
                >
                    <a
                        :href="href"
                        class="menu-link"
                        :class="{
                            'menu-link--collapsed': isCollapsed,
                            'menu-link-active': isLeafActive(item),
                        }"
                        :aria-current="isLeafActive(item) ? 'page' : undefined"
                        :aria-label="resolveLabel(item)"
                        :title="isCollapsed ? resolveLabel(item) : undefined"
                        @click="onMenuNavigate($event, navigate)"
                    >
                        <i :class="item.icon" class="menu-link-icon" aria-hidden="true" />
                        <span
                            v-if="!isCollapsed"
                            class="menu-link-label"
                        >
                            {{ resolveLabel(item) }}
                        </span>
                    </a>
                </router-link>
            </template>
        </li>
    </ul>

    <Teleport to="body">
        <div
            v-if="isCollapsed && flyoutItem && flyoutStyle"
            :id="flyoutId(flyoutIndex)"
            class="menu-flyout"
            role="menu"
            :aria-label="resolveLabel(flyoutItem)"
            :style="flyoutStyle"
            @mouseenter="keepFlyoutOpen"
            @mouseleave="onItemLeave"
        >
            <p class="menu-flyout-title">{{ resolveLabel(flyoutItem) }}</p>
            <router-link
                v-for="child in flyoutItem.items"
                :key="child.key || child.labelKey || child.label"
                v-slot="{ href, navigate }"
                :to="child.to"
                custom
            >
                <a
                    :href="href"
                    class="menu-flyout-link"
                    :class="{ 'menu-flyout-link-active': isLeafActive(child) }"
                    role="menuitem"
                    :aria-current="isLeafActive(child) ? 'page' : undefined"
                    @click="onFlyoutNavigate($event, navigate)"
                >
                    <i
                        v-if="child.icon"
                        :class="child.icon"
                        class="menu-flyout-icon"
                        aria-hidden="true"
                    />
                    <span>{{ resolveLabel(child) }}</span>
                </a>
            </router-link>
        </div>
    </Teleport>
</template>

<script>
import { computed, inject, nextTick, onBeforeUnmount, ref, unref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
    name: 'Submenu',

    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },

    setup(props) {
        const route = useRoute();
        const { t } = useI18n();
        const sidebarCollapsedInjected = inject('sidebarCollapsed', false);
        const isCollapsed = computed(() => Boolean(unref(sidebarCollapsedInjected)));

        const resolveLabel = (item) => {
            if (!item) {
                return '';
            }

            if (item.labelKey) {
                return t(item.labelKey);
            }

            return item.label || '';
        };

        const manualOpenIndex = ref(null);
        const manualCloseIndex = ref(null);
        const flyoutIndex = ref(null);
        const flyoutStyle = ref(null);
        const triggerRefs = ref({});
        let leaveTimer = null;

        const currentNavKey = computed(() => route.meta?.navKey || null);
        const currentParentNavKey = computed(() => route.meta?.parentNavKey || null);

        const flyoutItem = computed(() => {
            if (flyoutIndex.value == null) {
                return null;
            }

            return props.items[flyoutIndex.value] || null;
        });

        const isLeafActive = (item) => Boolean(item?.key) && currentNavKey.value === item.key;

        const isGroupRouteActive = (item) => Boolean(item?.key) && currentParentNavKey.value === item.key;

        const isGroupOpen = (item, index) => {
            if (isCollapsed.value) {
                return false;
            }

            if (manualCloseIndex.value === index) {
                return false;
            }

            if (manualOpenIndex.value === index) {
                return true;
            }

            return isGroupRouteActive(item);
        };

        const isFlyoutOpen = (index) => flyoutIndex.value === index;

        const flyoutId = (index) => `admin-menu-flyout-${index}`;

        const setTriggerRef = (index, el) => {
            if (el) {
                triggerRefs.value[index] = el;
            }
        };

        const clearLeaveTimer = () => {
            if (leaveTimer) {
                clearTimeout(leaveTimer);
                leaveTimer = null;
            }
        };

        const closeFlyout = () => {
            clearLeaveTimer();
            flyoutIndex.value = null;
            flyoutStyle.value = null;
        };

        const updateFlyoutPosition = (index) => {
            const trigger = triggerRefs.value[index];

            if (!trigger) {
                flyoutStyle.value = null;
                return;
            }

            const rect = trigger.getBoundingClientRect();
            const top = Math.min(rect.top, window.innerHeight - 16);
            const left = rect.right + 8;

            flyoutStyle.value = {
                top: `${Math.max(8, top)}px`,
                left: `${left}px`,
            };
        };

        const openFlyout = async (index) => {
            clearLeaveTimer();
            flyoutIndex.value = index;
            await nextTick();
            updateFlyoutPosition(index);
        };

        const keepFlyoutOpen = () => {
            clearLeaveTimer();
        };

        const onItemEnter = (index, item) => {
            if (!isCollapsed.value || !item.items) {
                return;
            }

            openFlyout(index);
        };

        const onItemLeave = () => {
            if (!isCollapsed.value) {
                return;
            }

            clearLeaveTimer();
            leaveTimer = setTimeout(() => {
                closeFlyout();
            }, 120);
        };

        const toggleGroup = (index) => {
            const item = props.items[index];
            const currentlyOpen = isGroupOpen(item, index);

            if (currentlyOpen) {
                manualOpenIndex.value = null;
                manualCloseIndex.value = index;
                return;
            }

            manualCloseIndex.value = null;
            manualOpenIndex.value = index;
        };

        const onGroupClick = (index, item) => {
            if (isCollapsed.value) {
                if (isFlyoutOpen(index)) {
                    closeFlyout();
                } else {
                    openFlyout(index);
                }
                return;
            }

            toggleGroup(index);
        };

        const onGroupKeydown = (event, index, item) => {
            if (event.code === 'Escape' && isCollapsed.value) {
                closeFlyout();
                event.preventDefault();
                return;
            }

            if (event.code === 'ArrowRight' && isCollapsed.value && item.items) {
                openFlyout(index);
                event.preventDefault();
            }

            if (event.code === 'ArrowLeft' && isCollapsed.value) {
                closeFlyout();
                event.preventDefault();
            }
        };

        const onMenuNavigate = (event, navigate) => {
            navigate(event);
        };

        const onFlyoutNavigate = (event, navigate) => {
            closeFlyout();
            navigate(event);
        };

        const resetManualState = () => {
            manualOpenIndex.value = null;
            manualCloseIndex.value = null;
            closeFlyout();
        };

        watch(() => route.fullPath, resetManualState);
        watch(isCollapsed, resetManualState);

        const onWindowChange = () => {
            if (flyoutIndex.value != null) {
                updateFlyoutPosition(flyoutIndex.value);
            }
        };

        window.addEventListener('resize', onWindowChange);
        window.addEventListener('scroll', onWindowChange, true);

        onBeforeUnmount(() => {
            clearLeaveTimer();
            window.removeEventListener('resize', onWindowChange);
            window.removeEventListener('scroll', onWindowChange, true);
        });

        return {
            isCollapsed,
            resolveLabel,
            isLeafActive,
            isGroupRouteActive,
            isGroupOpen,
            isFlyoutOpen,
            flyoutId,
            flyoutIndex,
            flyoutItem,
            flyoutStyle,
            setTriggerRef,
            onItemEnter,
            onItemLeave,
            keepFlyoutOpen,
            onGroupClick,
            onGroupKeydown,
            onMenuNavigate,
            onFlyoutNavigate,
        };
    },
};
</script>

<style scoped>
.menu-root {
    margin: 0;
    padding: 0;
    list-style: none;
}

.menu-root--collapsed .menu-item {
    position: relative;
}

.menu-root--collapsed .menu-link--collapsed {
    justify-content: center;
    gap: 0;
    padding-left: 0.65rem;
    padding-right: 0.65rem;
}

.menu-root--collapsed .menu-link-icon {
    margin: 0;
}

/* Tree Container — expanded only */

.submenu-container {
    position: relative;

    margin: 0 0 0 1rem;
    padding-left: 0.75rem;

    list-style: none;
}

.submenu-container::before {
    content: '';

    position: absolute;

    left: 0;
    top: 0;
    bottom: 0;

    width: 1px;

    background: var(--admin-border);
}

.submenu-link {
    padding-left: 1.5rem;
}

.submenu-link::after {
    content: '';

    position: absolute;

    left: -0.75rem;
    top: 50%;

    width: 0.75rem;
    height: 1px;

    background: var(--admin-border);

    transform: translateY(-50%);
}

.menu-link {
    position: relative;

    display: flex;
    align-items: center;
    gap: 0.65rem;

    padding: 0.55rem 0.75rem;
    margin: 0.1rem 0;

    overflow: hidden;

    border: 1px solid transparent;
    border-radius: 8px;

    color: var(--rw-nav-text, var(--admin-text-muted));
    font-family: var(--admin-font-ui, var(--rw-font-sans, Inter, sans-serif));
    font-size: 0.8125rem;
    text-decoration: none;

    transition: background-color 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}

.menu-link::before {
    content: '';

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    width: 3px;

    background: var(--admin-primary);

    opacity: 0;
    transform: scaleY(0);

    transition: all 0.25s ease;
}

.menu-link:hover,
.menu-link.menu-link-active,
.menu-link:focus-visible {
    background: var(--admin-nav-active-bg);
    border-color: var(--admin-nav-active-border);
    color: var(--admin-nav-active-text);
    outline: none;
}

.menu-link:hover::before,
.menu-link.menu-link-active::before,
.menu-link:focus-visible::before {
    opacity: 1;
    transform: scaleY(1);
}

.menu-link:focus-visible {
    box-shadow: var(--rw-nav-focus-shadow);
}

.menu-link-label {
    font-family: var(--admin-font-ui, var(--rw-font-sans, Inter, sans-serif));
    font-size: 0.8125rem;
    font-weight: 500;
    letter-spacing: 0.01em;
}

.menu-link-icon {
    width: 1.25rem;
    text-align: center;
    font-size: 0.95rem;
    color: inherit;
    transition: transform 0.22s ease, color 0.22s ease;
}

.menu-link:hover .menu-link-icon,
.menu-link.menu-link-active .menu-link-icon,
.menu-link:focus-visible .menu-link-icon {
    transform: scale(1.06);
}

.layout-submenu-wrapper-enter-active,
.layout-submenu-wrapper-leave-active {
    overflow: hidden;
    transition:
        opacity 200ms ease-out,
        max-height 220ms ease-out;
}

.layout-submenu-wrapper-enter-from,
.layout-submenu-wrapper-leave-to {
    opacity: 0;
    max-height: 0;
}

.layout-submenu-wrapper-enter-to,
.layout-submenu-wrapper-leave-from {
    opacity: 1;
    max-height: 500px;
}

@media (prefers-reduced-motion: reduce) {
    .layout-submenu-wrapper-enter-active,
    .layout-submenu-wrapper-leave-active {
        transition: none;
    }
}
</style>

<style>
.menu-flyout {
    position: fixed;
    z-index: 1200;
    min-width: 12.5rem;
    max-width: 16rem;
    padding: 0.5rem;
    border: 1px solid var(--admin-border);
    border-radius: 0.75rem;
    background: var(--admin-sidebar-bg);
    box-shadow: var(--admin-shadow-soft);
}

.menu-flyout-title {
    margin: 0 0 0.35rem;
    padding: 0.4rem 0.65rem 0.55rem;
    border-bottom: 1px solid var(--admin-border);
    color: var(--admin-text);
    font-size: 0.8rem;
    font-weight: 600;
}

.menu-flyout-link {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    color: var(--admin-text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
}

.menu-flyout-link:hover,
.menu-flyout-link:focus-visible,
.menu-flyout-link-active {
    background: var(--admin-nav-active-bg);
    border-color: var(--admin-nav-active-border);
    color: var(--admin-nav-active-text);
    outline: none;
}

.menu-flyout-link:focus-visible {
    box-shadow: var(--rw-focus-shadow);
}

.menu-flyout-icon {
    width: 1rem;
    text-align: center;
}
</style>
