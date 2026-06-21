<template>
    <ul v-if="items" class="menu-root">
        <li
            v-for="(item, i) in items"
            :key="item.label || i"
        >
            <!-- Group Menu -->
            <template v-if="item.items">

                <a
                    href="#"
                    class="menu-link"
                    @click.prevent="toggleGroup(i)"
                >
                    <i :class="item.icon" class="menu-link-icon" />

                    <span
                        class="menu-link-label"
                        :class="sidebarCollapsed ? 'pointer-events-none w-0 overflow-hidden opacity-0' : ''"
                    >
                        {{ item.label }}
                    </span>

                    <i
                        class="pi ml-auto"
                        :class="
                            activeIndex === i
                                ? 'pi-chevron-down'
                                : 'pi-chevron-right'
                        "
                    />
                </a>

                <transition name="layout-submenu-wrapper">
                    <ul
                        v-show="activeIndex === i"
                        class="submenu-container"
                    >
                        <li
                            v-for="child in item.items"
                            :key="child.label"
                        >
                            <router-link
                                :to="child.to"
                                class="menu-link submenu-link"
                                active-class="router-link-active"
                                exact-active-class="router-link-exact-active"
                            >
                                <i
                                    :class="child.icon"
                                    class="menu-link-icon"
                                />

                                <span
                                    class="menu-link-label"
                                    :class="sidebarCollapsed ? 'pointer-events-none w-0 overflow-hidden opacity-0' : ''"
                                >
                                    {{ child.label }}
                                </span>
                            </router-link>
                        </li>
                    </ul>
                </transition>

            </template>

            <!-- Normal Link -->
            <template v-else>

                <router-link
                    :to="item.to"
                    class="menu-link"
                    active-class="router-link-active"
                    exact-active-class="router-link-exact-active"
                >
                    <i :class="item.icon" class="menu-link-icon" />

                    <span
                        class="menu-link-label"
                        :class="sidebarCollapsed ? 'pointer-events-none w-0 overflow-hidden opacity-0' : ''"
                    >
                        {{ item.label }}
                    </span>
                </router-link>

            </template>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Submenu',

    inject: ['sidebarCollapsed'],

    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            activeIndex: null,
        };
    },

    methods: {
        toggleGroup(index) {
            this.activeIndex =
                this.activeIndex === index
                    ? null
                    : index;
        },
    },
};
</script>

<style scoped>
.menu-root {
    margin: 0;
    padding: 0;
    list-style: none;
}

/* Tree Container */

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

/* Child Item */

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

/* Existing Hover Style */

.menu-link {
    position: relative;

    display: flex;
    align-items: center;
    gap: 0.85rem;

    padding: 0.9rem 1rem;
    margin: 0.35rem 0;

    overflow: hidden;

    color: var(--admin-text-muted);
    text-decoration: none;

    transition: all 0.25s ease;
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
.menu-link.router-link-active,
.menu-link.router-link-exact-active {
    background: linear-gradient(
        90deg,
        rgba(139, 59, 86, 0.22),
        rgba(122, 49, 73, 0.08)
    );

    color: var(--admin-primary);
}

.menu-link:hover::before,
.menu-link.router-link-active::before,
.menu-link.router-link-exact-active::before {
    opacity: 1;
    transform: scaleY(1);
}

.menu-link-icon {
    width: 1.25rem;
    text-align: center;
    font-size: 1rem;

    color: inherit;

    transition: all 0.25s ease;
}

.menu-link:hover .menu-link-icon,
.menu-link.router-link-active .menu-link-icon,
.menu-link.router-link-exact-active .menu-link-icon {
    transform: scale(1.08);
}

.menu-link-label {
    font-size: 0.95rem;
    font-weight: 500;
}

/* Accordion Animation */

.layout-submenu-wrapper-enter-active,
.layout-submenu-wrapper-leave-active {
    overflow: hidden;
    transition: all 0.25s ease;
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
</style>