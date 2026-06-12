<template>
    <ul v-if="items" class="m-0 list-none p-0">
        <template v-for="(item, i) of items" :key="item.label || i">
            <li
                v-if="visible(item) && !item.separator"
                :class="[
                    {
                        'mt-3 first:mt-0': root,
                        'active-menuitem': activeIndex === i && !item.to && !item.disabled,
                    },
                ]"
                role="none"
            >
                <template v-if="root">
                    <div
                        v-if="item.label"
                        class="px-4 pb-1 pt-4 text-[0.68rem] uppercase tracking-[0.18em] text-white/45 transition-all duration-300"
                        :class="sidebarCollapsed ? 'pointer-events-none w-0 overflow-hidden opacity-0' : ''"
                        :aria-label="item.label"
                    >
                        {{ item.label }}
                    </div>
                    <Submenu
                        :items="visible(item) && item.items"
                        @menuitem-click="$emit('menuitem-click', $event)"
                    />
                </template>

                <template v-else>
                    <router-link
                        v-if="item.to"
                        v-ripple
                        :to="item.to"
                        :class="[item.class, 'menu-link p-ripple', { 'p-disabled': item.disabled }]"
                        :style="item.style"
                        :target="item.target"
                        :aria-label="item.label"
                        active-class="router-link-active"
                        exact-active-class="router-link-exact-active"
                        role="menuitem"
                        @click="onMenuItemClick($event, item, i)"
                    >
                        <i :class="item.icon" class="menu-link-icon" />
                        <span
                            class="menu-link-label"
                            :class="sidebarCollapsed ? 'pointer-events-none w-0 overflow-hidden opacity-0' : ''"
                        >{{ item.label }}</span>
                        <i
                            v-if="item.items"
                            class="pi menuitem-toggle-icon ml-auto"
                            :class="activeIndex === i ? 'pi-chevron-up' : 'pi-chevron-down'"
                        />
                        <Badge v-if="item.badge" :value="item.badge" class="ml-auto" />
                    </router-link>

                    <a
                        v-else
                        v-ripple
                        :href="item.url || '#'"
                        :style="item.style"
                        :class="[item.class, 'menu-link p-ripple', { 'p-disabled': item.disabled }]"
                        :target="item.target"
                        :aria-label="item.label"
                        role="menuitem"
                        @click="onMenuItemClick($event, item, i)"
                    >
                        <i :class="item.icon" class="menu-link-icon" />
                        <span
                            class="menu-link-label"
                            :class="sidebarCollapsed ? 'pointer-events-none w-0 overflow-hidden opacity-0' : ''"
                        >{{ item.label }}</span>
                        <i
                            v-if="item.items"
                            class="pi menuitem-toggle-icon ml-auto"
                            :class="activeIndex === i ? 'pi-chevron-up' : 'pi-chevron-down'"
                        />
                        <Badge v-if="item.badge" :value="item.badge" class="ml-auto" />
                    </a>

                    <transition name="layout-submenu-wrapper">
                        <Submenu
                            v-show="activeIndex === i"
                            :items="visible(item) && item.items"
                            @menuitem-click="$emit('menuitem-click', $event)"
                        />
                    </transition>
                </template>
            </li>

            <li
                v-if="visible(item) && item.separator"
                :key="`separator-${i}`"
                class="p-menu-separator"
                :style="item.style"
                role="separator"
            />
        </template>
    </ul>
</template>

<script>
import { inject } from 'vue';
import Badge from 'primevue/badge';

export default {
    name: 'Submenu',
    components: { Badge },
    props: {
        items: Array,
        root: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['menuitem-click'],
    setup() {
        const sidebarCollapsed = inject('sidebarCollapsed', false);

        return { sidebarCollapsed };
    },
    data() {
        return {
            activeIndex: null,
        };
    },
    methods: {
        onMenuItemClick(event, item, index) {
            if (item.disabled) {
                event.preventDefault();
                return;
            }

            if (!item.to && !item.url) {
                event.preventDefault();
            }

            if (item.command) {
                item.command({ originalEvent: event, item });
            }

            this.activeIndex = index === this.activeIndex ? null : index;

            this.$emit('menuitem-click', {
                originalEvent: event,
                item,
            });
        },
        visible(item) {
            return true;
        },
    },
};
</script>

<style scoped>
.menu-link {
    position: relative;
    display: flex;
    border: none;
    align-items: center;
    border-radius: 0.1rem;
    gap: 1px;
    margin: 0.2rem 0;
    overflow: hidden;
    padding: 0.85rem;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.88);
    transition: all 0.3s ease;
}

.menu-link::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    background: var(--admin-secondary);
    opacity: 0;
    transform: scaleY(0.4);
    transition: all 0.3s ease;
}

.menu-link:hover {
    transform: translateX(0.25rem);
    background: rgba(255, 255, 255, 0.1);
}

.menu-link:hover .menu-link-icon {
    transform: scale(1.1);
    color: #fff;
}

.menu-link.router-link-active,
.menu-link.router-link-exact-active {
    color: #fff;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.06));
}

.menu-link.router-link-active::before,
.menu-link.router-link-exact-active::before {
    opacity: 1;
    transform: scaleY(1);
}

.menu-link.router-link-active .menu-link-icon,
.menu-link.router-link-exact-active .menu-link-icon {
    color: #fff;
}

.menu-link-icon {
    width: 1.25rem;
    text-align: center;
    font-size: 1.05rem;
    color: var(--admin-secondary);
    transition: all 0.3s ease;
}

.menu-link-label {
    font-size: 0.94rem;
    font-weight: 500;
    white-space: nowrap;
    transition: all 0.3s ease;
}

.layout-submenu-wrapper-enter-active {
    overflow: hidden;
    transition: max-height 1s ease-in-out;
}

.layout-submenu-wrapper-leave-active {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);
}

.layout-submenu-wrapper-enter-from,
.layout-submenu-wrapper-leave-to {
    max-height: 0;
}

.layout-submenu-wrapper-enter-to,
.layout-submenu-wrapper-leave-from {
    max-height: 1000px;
}
</style>
