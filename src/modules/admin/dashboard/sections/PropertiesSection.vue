<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';
import PropertySpotlightPanel from '../components/PropertySpotlightPanel.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <DashboardManagedSection
        section-key="properties"
        title="Property Management"
        subtitle="Favorite, compare, and review the latest listings"
        admin-route="/admin/rooms"
    >
        <template #default="{ items }">
            <div
                v-if="dashboard.favoriteProperties.length"
                class="mb-4"
            >
                <PropertySpotlightPanel
                    title="Your Favorites"
                    :properties="dashboard.favoriteProperties"
                    :loading="false"
                    :format-currency="dashboard.formatCurrency"
                    :is-favorite="dashboard.isFavorite"
                    :is-in-compare="dashboard.isInCompare"
                    :can-add-to-compare="dashboard.canAddToCompare"
                    @view="dashboard.viewProperty"
                    @favorite="dashboard.handleFavorite"
                    @compare="dashboard.handleCompare"
                />
            </div>

            <div class="dashboard-table-wrap">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Fav</th>
                            <th>Property</th>
                            <th>Building</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in items"
                            :key="item.id"
                        >
                            <td>
                                <button
                                    type="button"
                                    class="dashboard-icon-toggle"
                                    :class="{ 'dashboard-icon-toggle-active': dashboard.isFavorite(item.id) }"
                                    aria-label="Toggle favorite"
                                    @click="dashboard.handleFavorite(item)"
                                >
                                    <i :class="dashboard.isFavorite(item.id) ? 'pi pi-heart-fill' : 'pi pi-heart'" />
                                </button>
                            </td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.building }}</td>
                            <td>{{ item.type }}</td>
                            <td><StatusBadge :value="item.status" /></td>
                            <td>{{ dashboard.formatCurrency(item.price) }}</td>
                            <td>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        class="dashboard-control"
                                        :class="{ 'dashboard-control-active': dashboard.isInCompare(item.id) }"
                                        :disabled="!dashboard.isInCompare(item.id) && !dashboard.canAddToCompare"
                                        @click="dashboard.handleCompare(item)"
                                    >
                                        Compare
                                    </button>
                                    <button
                                        type="button"
                                        class="dashboard-control dashboard-control-primary"
                                        @click="dashboard.viewProperty(item)"
                                    >
                                        View
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DashboardManagedSection>
</template>

<style scoped src="../dashboardShared.css"></style>
