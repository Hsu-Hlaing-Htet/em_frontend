<script setup>
import { computed } from 'vue';
import ThemeToggle from '@/components/global/ThemeToggle.vue';
import DashboardDetailModal from './components/DashboardDetailModal.vue';
import DashboardSectionNav from './components/DashboardSectionNav.vue';
import DashboardSkeleton from './components/DashboardSkeleton.vue';
import PropertyCompareModal from './components/PropertyCompareModal.vue';
import { DASHBOARD_SECTION_COMPONENTS } from './sections';
import { useDashboard } from './useDashboard';
import { useParallax } from './useParallax';
import './dashboardEffects.css';
import './dashboardShared.css';

const {
    loading,
    error,
    lastUpdatedLabel,
    autoRefresh,
    activeSection,
    activeSectionMeta,
    globalSearch,
    modalOpen,
    modalTitle,
    modalItem,
    unreadNotificationCount,
    refresh,
    toggleAutoRefresh,
    setSection,
    closeModal,
    compareItems,
    compareModalOpen,
    formatCurrency,
    removeFromCompare,
    clearCompare,
    openCompareModal,
} = useDashboard();

const { layerBack, layerMid, layerFront } = useParallax();

const activeSectionComponent = computed(() => DASHBOARD_SECTION_COMPONENTS[activeSection.value]);
</script>

<template>
    <div class="admin-dashboard flex flex-col gap-5">
      


        <DashboardSkeleton
            v-if="loading"
            :rows="6"
            :columns="4"
        />

        <div
            v-else
            class="flex flex-col gap-5"
        >
            <DashboardSectionNav
                :active-section="activeSection"
                :unread-notification-count="unreadNotificationCount"
                @select="setSection"
            />

            <Transition
                name="dashboard-tab"
                mode="out-in"
            >
                <div
                    :key="activeSection"
                    class="dashboard-section-root"
                >
                    <component :is="activeSectionComponent" />
                </div>
            </Transition>
        </div>

        <div
            v-if="compareItems.length"
            class="dashboard-compare-bar dashboard-glass"
        >
            <span class="text-sm text-[var(--admin-text-muted)]">
                {{ compareItems.length }} propert{{ compareItems.length === 1 ? 'y' : 'ies' }} selected for compare
            </span>

            <div class="flex flex-wrap gap-2">
                <button
                    type="button"
                    class="dashboard-control"
                    :disabled="compareItems.length < 2"
                    @click="openCompareModal"
                >
                    Compare now
                </button>
                <button
                    type="button"
                    class="dashboard-control"
                    @click="clearCompare"
                >
                    Clear
                </button>
            </div>
        </div>

        <PropertyCompareModal
            :visible="compareModalOpen"
            :items="compareItems"
            :format-currency="formatCurrency"
            @close="compareModalOpen = false"
            @remove="removeFromCompare"
            @clear="clearCompare"
        />

        <DashboardDetailModal
            :visible="modalOpen"
            :title="modalTitle"
            :item="modalItem"
            @close="closeModal"
        />
    </div>
</template>

<style scoped>
.dashboard-alert {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 1rem;
    border: 1px solid rgba(220, 38, 38, 0.18);
    background: rgba(220, 38, 38, 0.08);
    color: #b42318;
    padding: 1rem 1.25rem;
}
</style>
