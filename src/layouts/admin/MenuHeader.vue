<template>
    <div class="border-b border-white/10 px-3 pb-4 pt-5">
        <div class="flex items-center justify-between gap-2">
            <router-link
                :to="{ name: 'dashboard' }"
                class="flex min-w-0 items-center gap-3.5 text-white no-underline"
            >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
                    <img
                        src="@/assets/images/logo-dark.jpg"
                        alt="Rosewood Royale"
                        class="h-full w-full object-cover"
                    >
                </div>
                <div
                    class="min-w-0 transition-all duration-300"
                    :class="sidebarCollapsed ? 'pointer-events-none w-0 overflow-hidden opacity-0' : ''"
                >
                    <span class="block text-[var(--admin-text-muted)] font-medium tracking-wide">Rosewood Royale</span>
                </div>
            </router-link>

            <button
                v-if="!mobileMenuActive"
                type="button"
                class="flex h-5 w-5 cursor-pointer items-center justify-center text-white transition-all duration-300 hover:-translate-y-px"
                aria-label="Toggle sidebar"
                :aria-expanded="ariaExpanded"
                @click="onMenuToggle"
            >
                <i class="pi" :class="menuActive ? 'pi-angle-right' : 'pi-angle-left'" />
            </button>
        </div>
    </div>
</template>

<script>
import { inject } from 'vue';

export default {
    props: {
        menuActive: Boolean,
        mobileMenuActive: Boolean,
        ariaExpanded: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['menu-toggle'],
    setup() {
        const sidebarCollapsed = inject('sidebarCollapsed', false);

        return { sidebarCollapsed };
    },
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
    },
};
</script>
