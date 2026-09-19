<template>
    <div class="border-b border-[var(--admin-border)] px-3 pb-4 pt-5">
        <div class="flex items-center justify-between gap-2">
            <RosewoodBrand
                :to="{ name: 'dashboard' }"
                variant="on-light"
                :size="sidebarCollapsed ? 'compact' : 'md'"
                :show-name="!sidebarCollapsed"
                class="min-w-0"
            />

            <button
                v-if="!mobileMenuActive"
                type="button"
                class="flex h-5 w-5 cursor-pointer items-center justify-center text-[var(--admin-text-muted)] transition-all duration-300 hover:-translate-y-px hover:text-[var(--admin-text)]"
                :aria-label="$t('navigation.toggleSidebar')"
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
import RosewoodBrand from '@/components/global/RosewoodBrand.vue';

export default {
    components: {
        RosewoodBrand,
    },
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
