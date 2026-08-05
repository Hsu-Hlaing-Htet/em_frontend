<script setup>
import DashboardDetailModal from './components/DashboardDetailModal.vue';
import DashboardSkeleton from './components/DashboardSkeleton.vue';
import PropertyCompareModal from './components/PropertyCompareModal.vue';
import OverviewSection from './sections/OverviewSection.vue';
import { useDashboard } from './useDashboard';
import './dashboardEffects.css';
import './dashboardShared.css';

const {
    loading,
    modalOpen,
    modalTitle,
    modalItem,
    closeModal,
    compareItems,
    compareModalOpen,
    formatCurrency,
    removeFromCompare,
    clearCompare,
    openCompareModal,
} = useDashboard();
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
            <OverviewSection />
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
